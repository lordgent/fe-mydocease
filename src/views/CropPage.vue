<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center p-6">

    <div class="max-w-4xl w-full text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">Crop Your Image</h1>
      <p class="text-gray-600 sm:text-lg">Upload an image, crop it easily, and send it securely to the backend.</p>
    </div>

    <div class="w-full max-w-6xl flex flex-col md:flex-row gap-8">

      <div class="flex-1 flex flex-col gap-6">

        <div class="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center transition hover:shadow-md">
          <div class="w-16 h-16 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
            </svg>
          </div>
          
          <label for="fileUpload"
            class="cursor-pointer bg-gray-800 hover:bg-black text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-all active:scale-95">
            Select Image
          </label>
          <input id="fileUpload" type="file" accept="image/*" @change="onFile" class="hidden" />
          
          <p v-if="fileName" class="mt-4 text-gray-700 font-medium flex items-center gap-2">
            <span class="text-gray-400">Selected:</span> {{ fileName }}
          </p>
          <p v-else class="mt-4 text-sm text-gray-500">Supports JPG, PNG, and WebP</p>
        </div>

        <transition name="fade">
          <div v-if="imageUrl"
            class="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col gap-6 items-center transition hover:shadow-md">
            
            <h2 class="text-xl font-bold text-gray-900 self-start flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758L5 19m0-14l4.121 4.121" />
              </svg>
              Adjust Selection
            </h2>

            <div class="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-center">
              <ImageCropper 
                :image="imageUrl" 
                @cropped="saveCropped"
                class="max-w-full rounded-lg shadow-sm object-contain" 
              />
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
        
        <div class="space-y-4">
          <QueueList v-if="queue.length > 0" :items="queue" @retry="retryFile" @download="downloadFile" />

          <div v-else class="p-12 text-center bg-gray-50 border border-dashed border-gray-300 rounded-2xl text-gray-400">
            <p class="text-sm italic">No images being processed</p>
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
