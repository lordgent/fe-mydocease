<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center p-6">

    <div class="max-w-4xl w-full text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
        Word to PDF Converter
      </h1>
      <p class="text-gray-600 sm:text-lg">
        Convert your Word documents (.doc, .docx) to PDF instantly.
      </p>
    </div>

    <div class="w-full max-w-6xl flex flex-col md:flex-row gap-8">

      <div class="flex-1 flex flex-col gap-6">

        <div class="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center hover:shadow-md transition">
          <div class="w-16 h-16 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <label 
            class="relative cursor-pointer bg-gray-800 hover:bg-black text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-all active:scale-95">
            Choose Word File
            <input 
              type="file" 
              accept=".doc,.docx" 
              @change="onFile"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          </label>

          <p v-if="fileName" class="mt-4 text-gray-700 font-medium flex items-center gap-2">
            <span class="text-gray-400">Selected:</span> {{ fileName }}
          </p>
          <p v-else class="mt-4 text-sm text-gray-500">Supports .DOC and .DOCX formats</p>
        </div>

        <transition name="fade">
          <div v-if="file"
            class="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center gap-6 hover:shadow-md transition">

            <h2 class="text-2xl font-bold text-gray-900">
              Ready to Convert
            </h2>

            <div class="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 text-gray-700">
              <span class="text-xl">📄</span> 
              <span class="font-medium">{{ fileName }}</span>
            </div>

            <button 
              @click="upload" 
              :disabled="uploading || !fileBase64"
              class="w-full sm:w-auto px-12 py-4 bg-gray-800 hover:bg-black text-white font-bold rounded-xl shadow-lg shadow-gray-200 transition-all active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed">
              <div class="flex items-center justify-center gap-2">
                <span v-if="uploading" class="animate-spin">⏳</span>
                <span>{{ uploading ? 'Uploading...' : 'Convert to PDF Now' }}</span>
              </div>
            </button>
          </div>
        </transition>

      </div>

      <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
          Files in Progress
          <span class="text-xs bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-semibold border border-gray-200">
            {{ queue.length }}
          </span>
        </h2>

        <queue-list :items="queue" @retry="retryFile" @download="downloadFile" />
      </div>

    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { DocumentService } from "../services/document.service";
import { getDeviceInfo } from "../utils/DeviceInfo";
import QueueList from "../components/QueueList.vue";
import MESSAGES from "@/utils/message";

const { deviceId, address } = getDeviceInfo();

const file = ref(null);
const fileBase64 = ref(null);
const fileName = ref("");
const queue = ref([]);
const uploading = ref(false);
const loadingQueue = ref(false);

// Saat pilih file
const onFile = (e) => {
  const selected = e.target.files[0];
  if (!selected) return;

  // Reset sebelumnya
  file.value = null;
  fileBase64.value = null;
  fileName.value = "";

  file.value = selected;
  fileName.value = selected.name;

  const reader = new FileReader();
  reader.onload = () => {
    fileBase64.value = reader.result;
  };
  reader.readAsDataURL(selected);
};

const upload = async () => {
  if (!file.value || !fileBase64.value) return;

  uploading.value = true;

  try {
    const data = {
      image_base64: fileBase64.value,  
      mode: "word_to_pdf",
      device_id: deviceId,
      device_address: address,
      original_filename: fileName.value,
    };

    await DocumentService.upload(data);

    file.value = null;
    fileName.value = "";
    fileBase64.value = null;

    await getList();

  } catch (error) {
    window.$alert(
      MESSAGES.SYSTEM.SERVER_ERROR.message + " OR " + MESSAGES.SUBSCRIPTION.NONE.message,
      "error"
    );
  } finally {
    uploading.value = false;
  }
};

const getList = async () => {
  if (loadingQueue.value) return; // prevent overlapping
  loadingQueue.value = true;

  try {
    const res = await DocumentService.getQueue("word_to_pdf", deviceId);
    const data = res.images || [];

    queue.value = data.map(item => ({
      id: item.id,
      filename: item.original_filename,
      file_url: item.processed_url,
      status: item.status,
      mode: item.mode
    }));
  } catch (e) {
    console.error("Failed to fetch queue", e);
  } finally {
    loadingQueue.value = false;
  }
};

// Retry
const retryFile = async (id) => {
  try {
    await DocumentService.retry(id);
    await getList();
  } catch (e) {
    window.$alert(MESSAGES.SYSTEM.SERVER_ERROR.message, "error");
  }
};

// Download
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
