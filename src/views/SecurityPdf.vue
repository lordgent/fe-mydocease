<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center p-6">
    <div class="max-w-4xl w-full text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
        Protect PDF
      </h1>
      <p class="text-gray-600 sm:text-lg">
        Secure your documents with a password to prevent unauthorized access.
      </p>
    </div>

    <div class="w-full max-w-6xl flex flex-col md:flex-row gap-8">
      <div class="flex-1 flex flex-col gap-6">
        
        <div class="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center hover:shadow-md transition">
          <div v-if="!file" class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <label class="relative cursor-pointer bg-gray-800 hover:bg-black text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-all active:scale-95">
              Choose PDF File
              <input type="file" accept="application/pdf" @change="onFile" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </label>
            <p class="text-sm text-gray-500 mt-4">Select the PDF document you want to secure.</p>
          </div>

          <div v-else class="w-full">
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div class="flex items-center truncate">
                <span class="text-2xl mr-3">📄</span>
                <div class="flex flex-col truncate">
                  <span class="text-gray-900 font-medium truncate">{{ file.name }}</span>
                  <span class="text-xs text-gray-500">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</span>
                </div>
              </div>
              <button @click="removeFile" class="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition text-sm font-bold">
                REMOVE
              </button>
            </div>
          </div>
        </div>

        <transition name="fade">
          <div v-if="file" class="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col gap-6 hover:shadow-md transition">
            <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Security Settings
            </h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Password to Open PDF</label>
                <input 
                  v-model="password"
                  type="password"
                  placeholder="Create a password"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-800 focus:border-gray-800 outline-none transition"
                  @keyup.enter="upload"
                />
              </div>
            </div>

            <button 
              @click="upload"
              :disabled="!password || isUploading"
              :class="[!password || isUploading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-black text-white shadow-lg shadow-gray-200']"
              class="w-full py-4 font-bold rounded-xl transition-all flex justify-center items-center gap-2"
            >
              <span v-if="isUploading" class="animate-spin mr-2">⏳</span>
              {{ isUploading ? 'Processing...' : 'Protect PDF Now' }}
            </button>
          </div>
        </transition>
      </div>

      <div class="flex-1 bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition border border-gray-200">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
          Processed Files
          <span class="text-xs bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-semibold border border-gray-200">
            {{ queue.length }} files
          </span>
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

const file = ref(null);
const password = ref("");
const queue = ref([]);
const isUploading = ref(false);

const onFile = (e) => {
  const selected = e.target.files[0];
  if (selected && selected.type === 'application/pdf') {
    file.value = selected;
  } else {
    window.$alert("Please select a valid PDF file", "error");
  }
};

const removeFile = () => {
  file.value = null;
  password.value = "";
};

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const upload = async () => {
  if (!file.value || !password.value || isUploading.value) return;

  try {
    isUploading.value = true;
    const base64 = await toBase64(file.value);

    await DocumentService.upload({
      mode: 'pdf_password',
      device_id: deviceId,
      device_address: address,
      image_base64: base64, 
      original_filename: file.value.name,
      pdf_password: password.value 
    });

    // Reset Form
    file.value = null;
    password.value = "";
    await getList();
    window.$alert("File added to queue successfully", "success");

  } catch (error) {
    console.error(error);
    window.$alert(MESSAGES.SYSTEM.SERVER_ERROR.message, "error");
  } finally {
    isUploading.value = false;
  }
};

const getList = async () => {
  // Mode harus sama dengan mode saat upload
  const res = await DocumentService.getQueue("pdf_password", deviceId);
  queue.value = (res.images || []).map(item => ({
    id: item.id,
    filename: item.original_filename,
    file_url: item.processed_url,
    status: item.status,
    mode: item.mode
  }));
};

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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>