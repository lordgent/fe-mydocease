<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center p-6">

    <!-- Header -->
    <div class="max-w-4xl w-full text-center mb-10">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-2">Crop Your Image</h1>
      <p class="text-gray-600 sm:text-lg">Upload an image, crop it easily, and send it securely to the backend.</p>
    </div>

    <!-- Main content: Cropper & Queue -->
    <div class="w-full max-w-6xl flex flex-col md:flex-row gap-6">

      <!-- Left: Upload & Cropper -->
      <div class="flex-1 flex flex-col gap-4">

        <!-- Upload Card -->
        <div class="w-full bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center transition hover:shadow-2xl">
          <label for="fileUpload"
            class="cursor-pointer bg-gray-800 hover:bg-gray-900 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition">
            Select File
          </label>
          <input id="fileUpload" type="file" accept="image/*" @change="onFile" class="hidden" />
          <p v-if="fileName" class="mt-3 text-gray-600 font-medium">{{ fileName }}</p>
        </div>

        <!-- Cropper & Result -->
        <transition name="fade">
          <div v-if="imageUrl"
            class="w-full bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8 items-start transition hover:shadow-2xl">
            <!-- Original Image -->
            <div class="flex-1 flex flex-col items-center">
              <ImageCropper :image="imageUrl" @cropped="saveCropped"
                class="max-w-full rounded-xl shadow-md object-contain" />
            </div>

          </div>
        </transition>

      </div>

      <!-- Right: Queue File List -->
      <div class="flex-1 bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-2xl">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Files in Progress</h2>
        <div class="space-y-4">
          <QueueList v-if="queue.length > 0" :items="queue" @retry="retryFile" @download="downloadFile" />

          <div v-else class="p-4 text-center bg-gray-50 border rounded-xl text-gray-400">
            No files in progress
          </div>

        </div>

      </div>

    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ImageCropper from '../components/ImageCropper.vue'
import { getDeviceInfo } from "../utils/DeviceInfo";
import QueueList from '../components/QueueList.vue';
import { DocumentService } from "../services/document.service";
import MESSAGES from '@/utils/message';

const { deviceId, address } = getDeviceInfo();

const imageUrl = ref(null)
const result = ref(null)
const fileName = ref('')
const queue = ref([])

const onFile = e => {
  const file = e.target.files[0]
  if (!file) return

  fileName.value = file.name
  const reader = new FileReader()
  reader.onload = () => imageUrl.value = reader.result
  reader.readAsDataURL(file)
}

const saveCropped = base64 => {
  result.value = base64;
  upload();
}

const retryFile = async (id) => {
  const res = await DocumentService.retry(id);
  console.log(res);
  getListCropPage();
}

const downloadFile = async (file) => {
  try {
    await DocumentService.download(file);
  } catch (e) {
      window.$alert(MESSAGES.SYSTEM.DOWNLOAD_ERROR.message, "error");
  }
};

const getListCropPage = async () => {
  try {
    const res = await DocumentService.getQueue("crop", deviceId);

    const data = res.images
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
    queue.value = []
    console.error("Failed to fetch crop list:", err)
  }
}

const upload = async () => {
  if (!result.value) return
  try {

    const res = await DocumentService.upload({
      image_base64: result.value,
      mode: "crop",
      device_id: deviceId,
      device_address: address
    })

    result.value = null;
    imageUrl.value = null;
    await getListCropPage()

  } catch (err) {
    result.value = null;
    imageUrl.value = null;
    window.$alert(MESSAGES.SYSTEM.SERVER_ERROR.message + " OR " +  MESSAGES.SUBSCRIPTION.NONE.message, "error");
  }
}

let intervalId = null

onMounted(() => {
  getListCropPage()

  intervalId = setInterval(() => {
    getListCropPage()
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
