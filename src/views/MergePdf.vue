<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center p-6">

    <!-- Header -->
    <div class="max-w-4xl w-full text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
        Merge PDF
      </h1>
      <p class="text-gray-600 sm:text-lg">
        Combine multiple PDF files into one document.
      </p>
    </div>

    <!-- Main Content -->
    <div class="w-full max-w-6xl flex flex-col md:flex-row gap-8">

      <!-- LEFT -->
      <div class="flex-1 flex flex-col gap-6">

        <!-- Upload Card -->
        <div class="w-full bg-white rounded-2xl shadow-md p-8 flex flex-col items-center hover:shadow-lg transition">

          <!-- Label + Input File -->
          <label 
            class="relative cursor-pointer bg-gray-800 hover:bg-gray-900 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition">
            Choose PDF Files
            <input 
              type="file" 
              accept="application/pdf" 
              multiple 
              @change="onFiles" 
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          </label>

          <p class="text-sm text-gray-500 mt-2">
            On some mobile devices, you may need to select files one by one.
          </p>

          <!-- File List -->
          <ul v-if="files.length" class="mt-4 w-full text-gray-700">
            <li v-for="(f, i) in files" :key="i" class="flex justify-between items-center py-2 border-b">
              <span>📄 {{ f.name }}</span>
              <button @click="removeFile(i)" class="text-red-500 hover:underline text-sm">
                Remove
              </button>
            </li>
          </ul>
        </div>

        <!-- Preview / Merge Button -->
        <transition name="fade">
          <div v-if="files.length >= 2"
            class="w-full bg-white rounded-2xl shadow-md p-8 flex flex-col items-center gap-6 hover:shadow-lg transition">

            <h2 class="text-2xl font-semibold text-gray-900">
              Ready to Merge
            </h2>

            <p class="text-gray-700">
              {{ files.length }} PDF files selected
            </p>

            <button @click="upload"
              class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition">
              Merge PDFs
            </button>

          </div>
        </transition>

      </div>

      <!-- RIGHT -->
      <div class="flex-1 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Files in Progress
        </h2>

        <queue-list :items="queue" @retry="retryFile" @download="downloadFile" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import QueueList from "../components/QueueList.vue";
import { DocumentService } from "../services/document.service";
import { getDeviceInfo } from "../utils/DeviceInfo";
import MESSAGES from "@/utils/message";

const { deviceId, address } = getDeviceInfo();

const files = ref([]);
const queue = ref([]);

// Tambahkan batch file (mobile-friendly)
const onFiles = (e) => {
  const selected = Array.from(e.target.files || []);
  files.value.push(...selected);
};

// Remove file dari list
const removeFile = (index) => {
  files.value.splice(index, 1);
};

// Convert file ke base64
const toBase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
};

// Upload & merge PDF
const upload = async () => {
  try {
    if (files.value.length < 2) return;

    const pdfs = [];
    for (const file of files.value) {
      pdfs.push(await toBase64(file));
    }

    await DocumentService.mergePdf({
      device_id: deviceId,
      device_address: address,
      pdfs
    });

    files.value = [];
    await getList();

  } catch (error) {
    window.$alert(
      MESSAGES.SYSTEM.SERVER_ERROR.message + " OR " +  MESSAGES.SUBSCRIPTION.NONE.message,
      "error"
    );
  }
};

const getList = async () => {
  const res = await DocumentService.getQueue("merge_pdf", deviceId);
  queue.value = (res.images || []).map(item => ({
    id: item.id,
    filename: item.original_filename,
    file_url: item.processed_url,
    status: item.status,
    mode: item.mode
  }));
};

// Retry job
const retryFile = async (id) => {
  await DocumentService.retry(id);
  await getList();
};

const downloadFile = async (file) => {
  try {
    await DocumentService.download(file);
  } catch (e) {
      window.$alert(MESSAGES.SYSTEM.DOWNLOAD_ERROR.message, "error");
  }
};


let intervalId;
onMounted(() => {
  getList();
  intervalId = setInterval(getList, 3000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
