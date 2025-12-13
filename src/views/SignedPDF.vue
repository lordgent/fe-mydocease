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
        <queue-list :items="queue" @retry="retryFile" @download="downloadFile" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getDeviceInfo } from "../utils/DeviceInfo";
import PDFSignature from '../components/PDFSignature.vue';
import QueueList from '../components/QueueList.vue';

const { deviceId, address } = getDeviceInfo();

const queue = ref([]);

async function handlePDFExport(data) {
  console.log('PDF Exported:', data);
  
  try {
    await uploadToBackend(data.base64, data.filename);
  } catch (error) {
    console.error('Failed to upload PDF:', error);
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

    const res = await fetch("http://localhost:8000/api/v1/image/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    });


    const response = await res.json();
    console.log("Upload Response:", response);

    // Refresh queue list immediately
    await getListSignedPDFs();

  } catch (err) {
    console.error("Upload Failed:", err);
  }
}

async function getListSignedPDFs() {
  try {
    const res = await fetch(
      `http://localhost:8000/api/v1/image/device?device_id=${deviceId}&mode=signed`
    );
    const data = await res.json();
  if (data.images.length > 0) {
      queue.value = data.images.map(item => ({
        id: item.id,
        filename: item.original_filename,
        file_url: item.processed_url,
        status: item.status,
        mode: item.mode
      }));

    }
  } catch (err) {
    console.error("Failed to fetch signed PDFs:", err);
  }
}

// Retry File
async function retryFile(id) {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/pdf/retry/${id}`, {
      method: "POST"
    });
    console.log(res);
    await getListSignedPDFs();
  } catch (err) {
    console.error("Retry failed:", err);
  }
}

// Download File
function downloadFile(file) {
  const a = document.createElement('a');
  a.href = file.file_url;
  a.download = file.filename || "signed-document.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

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