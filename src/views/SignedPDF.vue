<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center p-6">

    <!-- Header -->
    <div class="max-w-4xl w-full text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">PDF Signature Tool</h1>
      <p class="text-gray-600 sm:text-lg">Add your signature to PDF documents effortlessly.</p>
    </div>

    <!-- Main Content: PDF Editor & Queue -->
    <div class="w-full max-w-6xl flex flex-col md:flex-row gap-8">

      <!-- Left: PDF Editor -->
      <div class="flex-1 flex flex-col gap-6">
        <PDFSignature @onExport="handlePDFExport" />
      </div>

      <!-- Right: Queue List -->
      <div class="flex-1 bg-white rounded-2xl shadow-md p-6 transition hover:shadow-lg">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Signed PDFs</h2>
        <queue-list :items="queue" @retry="retryFile" @download="downloadFile" :loading="loadingFetch"/>
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
const loadingFetch = ref(true)
const queue = ref([]);

async function handlePDFExport(data) {
  console.log('PDF Exported:', data);
  
  try {
    await uploadToBackend(data.base64, data.filename);
  } catch (error) {
    window.$alert(MESSAGES.SYSTEM.SERVER_ERROR.message + " OR " +  MESSAGES.SUBSCRIPTION.NONE, "error");
  }
}

// Upload to Backend
async function uploadToBackend(pdfBase64, filename) {
  try {


  let data = {
      image_base64: pdfBase64, 
      mode: "signed",
      device_id: deviceId,
      device_address: address,
      original_filename: filename
    };

    console.log("Sending signed PDF to backend...");
    const res = await DocumentService.upload(data);
    await getListSignedPDFs();

  } catch (err) {
    window.$alert(MESSAGES.SYSTEM.SERVER_ERROR.message + " OR " +  MESSAGES.SUBSCRIPTION.NONE.message, "error");
  }
}

async function getListSignedPDFs() {
  loadingFetch.value = true

  try {
    const res = await DocumentService.getQueue("signed",deviceId);

    const data = res.images;

    queue.value = (data || []).map(item => ({
      id: item.id,
      filename: item.original_filename,
      file_url: item.processed_url,
      status: item.status,
      mode: item.mode
    }))

  } catch (err) {
    console.error("Failed to fetch signed PDFs:", err)
    queue.value = [] 
  } finally {
    loadingFetch.value = false
  }
}


// Retry File
async function retryFile(id) {
  try {
    const res = await DocumentService.retry(id);
    await getListSignedPDFs();
  } catch (err) {
    console.error("Retry failed:", err);
  }
}

const downloadFile = async (file) => {
  try {
    await DocumentService.download(file);
  } catch (e) {
      window.$alert(MESSAGES.SYSTEM.DOWNLOAD_ERROR.message, "error");
  }
};

// Polling
let intervalId = null;

onMounted(() => {
  getListSignedPDFs();
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