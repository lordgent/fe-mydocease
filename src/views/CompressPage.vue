<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center p-6">

    <div class="max-w-4xl w-full text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
        Image Compression Tool
      </h1>
      <p class="text-gray-600 sm:text-lg">
        Effortlessly reduce your image file size while maintaining optimal quality.
      </p>
    </div>

    <div class="w-full max-w-6xl flex flex-col md:flex-row gap-8">

      <div class="flex-1 flex flex-col gap-6">

        <div class="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center transition hover:shadow-md">
          <div class="w-16 h-16 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <label for="fileUpload"
            class="cursor-pointer bg-gray-800 hover:bg-black text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-all active:scale-95">
            Choose Image
          </label>
          <input id="fileUpload" type="file" accept="image/*" @change="onFile" class="hidden" />
          <p v-if="fileName" class="mt-4 text-gray-700 font-medium flex items-center gap-2">
            <span class="text-gray-400">Selected:</span> {{ fileName }}
          </p>
        </div>

        <transition name="fade">
          <div v-if="imageUrl"
            class="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center space-y-6 transition hover:shadow-md">

            <h2 class="text-2xl font-bold text-gray-900">Adjust Compression Quality</h2>

            <div class="w-full px-4">
              <input type="range" min="0.1" max="1" step="0.05" v-model="q"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800" />
              <div class="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                <span>Small Size</span>
                <span>High Quality</span>
              </div>
            </div>
            
            <p class="text-gray-900 font-bold bg-gray-100 px-4 py-1 rounded-full text-sm">
              Selected Quality: {{ (q * 100).toFixed(0) }}%
            </p>

            <button @click="upload"
              :disabled="uploading || !imageUrl"
              class="w-full sm:w-auto px-12 py-3 bg-gray-800 hover:bg-black text-white font-bold rounded-xl shadow-lg shadow-gray-200 transition-all active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed">
              <span v-if="uploading">Compressing...</span>
              <span v-else>Compress Now</span>
            </button>

          </div>
        </transition>

        <transition name="fade">
          <div v-if="result"
            class="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row gap-8 items-start transition hover:shadow-md">

            <div class="flex-1 flex flex-col">
              <h2 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Original</h2>
              <img :src="imageUrl" class="w-full rounded-xl shadow-sm border border-gray-100 object-contain" />
            </div>

            <div class="flex-1 flex flex-col">
              <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Compressed</h2>
              <img :src="result" class="w-full rounded-xl shadow-md border border-gray-100 object-contain" />
            </div>

          </div>
        </transition>

      </div>

      <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition hover:shadow-md">
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
import { ref, onMounted, onUnmounted } from 'vue'
import { getDeviceInfo } from "../utils/DeviceInfo";
import QueueList from '../components/QueueList.vue';
import { DocumentService } from "../services/document.service";
import MESSAGES from '@/utils/message';

const { deviceId, address } = getDeviceInfo();

const imageUrl = ref(null)
const result = ref(null)
const q = ref(0.7)
const fileName = ref('')
const queue = ref([])

const uploading = ref(false)
const loadingQueue = ref(false)

// File select
const onFile = (e) => {
  const file = e.target.files[0]
  if (!file) return

  fileName.value = file.name
  result.value = null

  const reader = new FileReader()
  reader.onload = () => imageUrl.value = reader.result
  reader.readAsDataURL(file)
}

// Upload & compress
const upload = async () => {
  if (!imageUrl.value || uploading.value) return

  uploading.value = true
  try {
    const data = {
      image_base64: imageUrl.value,
      original_filename: fileName.value,
      mode: "compress",
      quality: Math.round(q.value * 100),
      device_id: deviceId,
      device_address: address
    }

    const res = await DocumentService.upload(data)

    // Assume backend returns processed image URL
    if (res.processed_url) result.value = res.processed_url

    // Reset file input
    imageUrl.value = null
    fileName.value = ''

    // Refresh queue
    await getListCompress()
  } catch (err) {
    window.$alert(MESSAGES.SYSTEM.SERVER_ERROR.message + " OR " +  MESSAGES.SUBSCRIPTION.NONE.message, "error")
  } finally {
    uploading.value = false
  }
}

// Get queue
const getListCompress = async () => {
  if (loadingQueue.value) return
  loadingQueue.value = true
  try {
    const res = await DocumentService.getQueue("compress", deviceId)
    const data = res.images || []
    queue.value = data.map(item => ({
      id: item.id,
      filename: item.original_filename,
      file_url: item.processed_url,
      status: item.status,
      mode: item.mode,
    }))
  } catch (err) {
    console.error("Failed to fetch compress list:", err)
  } finally {
    loadingQueue.value = false
  }
}

// Retry file
const retryFile = async (id) => {
  try {
    await DocumentService.retry(id)
    await getListCompress()
  } catch (err) {
    window.$alert(MESSAGES.SYSTEM.SERVER_ERROR.message, "error")
  }
}

// Download file
const downloadFile = async (file) => {
  try {
    await DocumentService.download(file)
  } catch (err) {
    window.$alert(MESSAGES.SYSTEM.DOWNLOAD_ERROR.message, "error")
  }
}

// Polling queue
let intervalId = null
onMounted(() => {
  getListCompress()
  intervalId = setInterval(getListCompress, 3000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
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
