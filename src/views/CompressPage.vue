<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center p-6">

    <!-- Header -->
    <div class="max-w-4xl w-full text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">Image Compression Tool</h1>
      <p class="text-gray-600 sm:text-lg">Effortlessly reduce your image file size while maintaining optimal quality.
      </p>
    </div>

    <!-- Main Content: Upload & Queue -->
    <div class="w-full max-w-6xl flex flex-col md:flex-row gap-8">

      <!-- Left: Upload & Compression Controls -->
      <div class="flex-1 flex flex-col gap-6">

        <!-- Upload Card -->
        <div class="w-full bg-white rounded-2xl shadow-md p-8 flex flex-col items-center transition hover:shadow-lg">
          <label for="fileUpload"
            class="cursor-pointer bg-gray-800 hover:bg-gray-900 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition">
            Choose Image
          </label>
          <input id="fileUpload" type="file" accept="image/*" @change="onFile" class="hidden" />
          <p v-if="fileName" class="mt-3 text-gray-700 font-medium">{{ fileName }}</p>
        </div>

        <!-- Compression Controls -->
        <transition name="fade">
          <div v-if="imageUrl"
            class="w-full bg-white rounded-2xl shadow-md p-8 flex flex-col items-center space-y-6 transition hover:shadow-lg">
            <h2 class="text-2xl font-semibold text-gray-900">Adjust Compression Quality</h2>

            <input type="range" min="0.1" max="1" step="0.05" v-model="q"
              class="w-full h-2 bg-gray-300 rounded-lg accent-indigo-600" />
            <p class="text-gray-600">Selected Quality: {{ (q * 100).toFixed(0) }}%</p>

            <button @click="upload()"
              class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
              Compress
            </button>

          </div>
        </transition>

        <!-- Compression Result -->
        <transition name="fade">
          <div v-if="result"
            class="w-full bg-white rounded-2xl shadow-md p-8 flex flex-col md:flex-row gap-8 items-center transition hover:shadow-lg">
            <div class="flex-1 flex flex-col items-center">
              <h2 class="text-xl font-semibold text-gray-900 mb-3">Original</h2>
              <img :src="imageUrl" class="max-w-full rounded-xl shadow-sm object-contain border border-gray-200" />
            </div>
          </div>
        </transition>

      </div>

      <div class="flex-1 bg-white rounded-2xl shadow-md p-6 transition hover:shadow-lg">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Files in Progress</h2>
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
const token = localStorage.getItem("token");

const imageUrl = ref(null)
const result = ref(null)
const q = ref(0.7)
const fileName = ref('')
const queue = ref([])

const onFile = (e) => {
  const file = e.target.files[0]
  if (!file) return
  fileName.value = file.name
  const reader = new FileReader()
  reader.onload = () => imageUrl.value = reader.result
  reader.readAsDataURL(file)
}

const downloadFile = async (file) => {
  try {
    await DocumentService.download(file);
  } catch (e) {
      window.$alert(MESSAGES.SYSTEM.DOWNLOAD_ERROR.message, "error");
  }
};

const getListCompress = async () => {
  try {
    const res = await DocumentService.getQueue("compress",deviceId,)
    const data = res.images;

    if (data.length > 0) {
      queue.value = data.map(item => ({
        id: item.id,
        filename: item.original_filename,
        file_url: item.processed_url,
        status: item.status,
        mode: item.mode,
      }));
    }
  } catch (err) {
    console.error("Failed to fetch compress list:", err);
  }
}


const retryFile = async (id) => {
  const res = await DocumentService.retry(id)
  console.log(res);
  getListCompress();
}

const upload = async () => {
  if (!imageUrl.value) return;

  try {
    let data = {
      image_base64: imageUrl.value,
      mode: "compress",
      quality: Math.round(q.value * 100),
      device_id: deviceId,
      device_address: address
    };

    console.log("DATA SENT TO BACKEND:", data);
    const res = await DocumentService.upload(data)
  } catch (err) {
    window.$alert(MESSAGES.SYSTEM.SERVER_ERROR.message + " OR " +  MESSAGES.SUBSCRIPTION.NONE.message, "error");
  }
};

let intervalId = null

onMounted(() => {
  getListCompress()
  intervalId = setInterval(() => {
    getListCompress()
  }, 3000)
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
