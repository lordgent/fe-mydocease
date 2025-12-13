<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center p-6">

    <!-- Header -->
    <div class="max-w-4xl w-full text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
        Image to PDF Converter
      </h1>
      <p class="text-gray-600 sm:text-lg">
        Convert your images into a single high-quality PDF file instantly.
      </p>
    </div>

    <!-- Main Content -->
    <div class="w-full max-w-6xl flex flex-col md:flex-row gap-8">

      <!-- LEFT SIDE -->
      <div class="flex-1 flex flex-col gap-6">

        <!-- Upload Card -->
        <div class="w-full bg-white rounded-2xl shadow-md p-8 flex flex-col items-center hover:shadow-lg transition">
          <label
            for="fileUpload"
            class="cursor-pointer bg-gray-800 hover:bg-gray-900 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition">
            Choose Image
          </label>
          <input id="fileUpload" type="file" accept="image/*" @change="onFile" class="hidden" />

          <p v-if="fileName" class="mt-3 text-gray-700 font-medium">{{ fileName }}</p>
        </div>

        <!-- Preview -->
        <transition name="fade">
          <div
            v-if="imageUrl"
            class="w-full bg-white rounded-2xl shadow-md p-8 flex flex-col items-center gap-6 hover:shadow-lg transition">

            <h2 class="text-2xl font-semibold text-gray-900">
              Preview Image
            </h2>

            <img :src="imageUrl"
                 class="max-w-full rounded-xl shadow object-contain border border-gray-200" />

            <button
              @click="upload"
              class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition">
              Convert to PDF
            </button>

          </div>
        </transition>

      </div>

      <!-- RIGHT SIDE : QUEUE LIST -->
      <div class="flex-1 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Files in Progress</h2>

        <queue-list
          :items="queue"
          @retry="retryFile"
          @download="downloadFile"
        />
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { getDeviceInfo } from "../utils/DeviceInfo";
import QueueList from "../components/QueueList.vue";

const { deviceId, address } = getDeviceInfo();

const imageUrl = ref(null);
const fileName = ref("");
const queue = ref([]);

const onFile = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  fileName.value = file.name;

  const reader = new FileReader();
  reader.onload = () => {
    imageUrl.value = reader.result;
  };
  reader.readAsDataURL(file);
};

const getList = async () => {
  try {
    const res = await fetch(
      `http://localhost:8000/api/v1/image/device?device_id=${deviceId}&mode=convert_pdf`
    );

    const data = await res.json();

    if (data.images.length > 0) {
      queue.value = data.images.map((item) => ({
        id: item.id,
        filename: item.original_filename,
        file_url: item.processed_url,
        status: item.status,
        mode: item.mode
      }));
    }
  } catch (err) {
    console.error("Failed fetching:", err);
  }
};

const retryFile = async (id) => {
  await fetch(`http://localhost:8000/api/v1/image/retry/${id}`, {
    method: "POST",
  });
  getList();
};

const downloadFile = (file) => {
  const a = document.createElement("a");
  a.href = file.file_url;
  a.download = file.filename || "output.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

const upload = async () => {
  if (!imageUrl.value) return;

  try {
    let data = {
      image_base64: imageUrl.value,
      mode: "convert_pdf",
      device_id: deviceId,
      device_address: address,
    };

    await fetch("http://localhost:8000/api/v1/image/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error("Upload Failed:", err);
  }
};

let intervalId = null;

onMounted(() => {
  getList();
  intervalId = setInterval(() => getList(), 3000);
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
