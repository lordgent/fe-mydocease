<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center p-6">

    <div class="max-w-4xl w-full text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
        PDF Signature Tool
      </h1>
      <p class="text-gray-600 sm:text-lg">
        Add your signature to PDF documents effortlessly.
      </p>
    </div>

    <div class="w-full max-w-6xl flex flex-col md:flex-row gap-8">

      <div class="flex-1 flex flex-col gap-6">
        <PDFSignature @onExport="handlePDFExport" />
      </div>

      <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition hover:shadow-md">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
          Signed PDFs
          <span v-if="queue.length" class="text-xs bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-semibold border border-gray-200">
            {{ queue.length }} files
          </span>
        </h2>
        
        <queue-list 
          :items="queue" 
          @retry="retryFile" 
          @download="downloadFile" 
          :loading="loadingFetch"
          class="divide-y divide-gray-100"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getDeviceInfo } from "../utils/DeviceInfo";
import PDFSignature from '../components/PDFSignature.vue';
import QueueList from '../components/QueueList.vue';
import { DocumentService } from "../services/document.service";
import MESSAGES from '@/utils/message';

const { deviceId, address } = getDeviceInfo();

const loadingFetch = ref(true);
const queue = ref([]);
const prevQueue = ref([]);

async function handlePDFExport(data) {
  console.log('PDF Exported:', data);

  try {
    await uploadToBackend(data.base64, data.filename);
  } catch (error) {
    window.$alert(
      MESSAGES.SYSTEM.SERVER_ERROR.message + " OR " + MESSAGES.SUBSCRIPTION.NONE.message,
      "error"
    );
  }
}

async function uploadToBackend(pdfBase64, filename) {
  try {
    const data = {
      image_base64: pdfBase64,
      mode: "signed",
      device_id: deviceId,
      device_address: address,
      original_filename: filename
    };

    await DocumentService.upload(data);

    await getListSignedPDFs();
  } catch (err) {
    window.$alert(
      MESSAGES.SYSTEM.SERVER_ERROR.message + " OR " + MESSAGES.SUBSCRIPTION.NONE.message,
      "error"
    );
  }
}

async function getListSignedPDFs({ showLoading = false } = {}) {
  if (showLoading) loadingFetch.value = true;

  try {
    const res = await DocumentService.getQueue("signed", deviceId);
    const data = res.images || [];

    const newQueue = data.map(item => ({
      id: item.id,
      filename: item.original_filename,
      file_url: item.processed_url,
      status: item.status,
      mode: item.mode
    }));

    const isChanged = JSON.stringify(newQueue) !== JSON.stringify(prevQueue.value);
    if (isChanged) {
      queue.value = newQueue;
      prevQueue.value = newQueue;
    }
  } catch (err) {
    queue.value = [];
  } finally {
    if (showLoading) loadingFetch.value = false;
  }
}

// Retry File
async function retryFile(id) {
  try {
    await DocumentService.retry(id);
    await getListSignedPDFs();
  } catch (err) {
    console.error("Retry failed:", err);
  }
}

// Download File
const downloadFile = async (file) => {
  try {
    await DocumentService.download(file);
  } catch (e) {
    window.$alert(MESSAGES.SYSTEM.DOWNLOAD_ERROR.message, "error");
  }
};

let intervalId = null;
onMounted(() => {
  getListSignedPDFs({ showLoading: true });

  intervalId = setInterval(() => {
    getListSignedPDFs(); 
  }, 3000);
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
