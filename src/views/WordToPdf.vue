<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center p-6">

    <!-- Header -->
    <div class="max-w-4xl w-full text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
        Word to PDF Converter
      </h1>
      <p class="text-gray-600 sm:text-lg">
        Convert your Word documents (.doc, .docx) to PDF instantly.
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
            Choose Word File
          </label>

          <input
            id="fileUpload"
            type="file"
            accept=".doc,.docx"
            @change="onFile"
            class="hidden"
          />

          <p v-if="fileName" class="mt-3 text-gray-700 font-medium">
            {{ fileName }}
          </p>
        </div>

        <!-- Preview -->
        <transition name="fade">
          <div
            v-if="file"
            class="w-full bg-white rounded-2xl shadow-md p-8 flex flex-col items-center gap-6 hover:shadow-lg transition">

            <h2 class="text-2xl font-semibold text-gray-900">
              Ready to Convert
            </h2>

            <div class="flex items-center gap-3 text-gray-700">
              📄 <span>{{ fileName }}</span>
            </div>

            <button
              @click="upload"
              class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition">
              Convert to PDF
            </button>

          </div>
        </transition>

      </div>

      <!-- RIGHT SIDE -->
      <div class="flex-1 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Files in Progress
        </h2>

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
  import { DocumentService } from "../services/document.service";

import { ref, onMounted, onUnmounted } from "vue";
import { getDeviceInfo } from "../utils/DeviceInfo";
import QueueList from "../components/QueueList.vue";
const token = localStorage.getItem("token");

const { deviceId, address } = getDeviceInfo();

const file = ref(null);
const fileBase64 = ref(null);
const fileName = ref("");
const queue = ref([]);

const onFile = (e) => {
  const selected = e.target.files[0];
  if (!selected) return;

  file.value = selected;
  fileName.value = selected.name;

  const reader = new FileReader();
  reader.onload = () => {
    fileBase64.value = reader.result; 
  };
  reader.readAsDataURL(selected);
};


const upload = async () => {
  if (!file.value) return;

  const reader = new FileReader();

  reader.onload = async () => {
    const base64 = reader.result; 

    const data = {
      image_base64: base64,
      mode: "word_to_pdf",
      device_id: deviceId,
      device_address: address,
      original_filename: fileName.value,
    };

   await DocumentService.upload(data);

    file.value = null;
    fileName.value = "";
  };

  reader.readAsDataURL(file.value);
};


const getList = async () => {
  const res = await DocumentService.getQueue("word_to_pdf", deviceId);
  const data = res.images

  queue.value = data.map(item => ({
    id: item.id,
    filename: item.original_filename,
    file_url: item.processed_url,
    status: item.status,
    mode: item.mode
  }));
};

const retryFile = async (id) => {
  await DocumentService.retry(id);
  getList();
};
const downloadFile = (file) => {
  const a = document.createElement("a");
  a.href = file.file_url;
  a.download = file.filename || "output.pdf";
  a.click();
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
