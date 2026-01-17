<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center p-6">

    <!-- Header -->
    <div class="max-w-4xl w-full text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
        Add Watermark PDF
      </h1>
      <p class="text-gray-600 sm:text-lg">
        Add text watermark to your PDF document.
      </p>
    </div>

    <div class="w-full max-w-6xl flex flex-col md:flex-row gap-8">

      <!-- LEFT -->
      <div class="flex-1 flex flex-col gap-6">

        <!-- Upload -->
        <div class="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6">

          <label class="cursor-pointer bg-gray-800 text-white px-6 py-3 rounded-xl text-center">
            Choose PDF File
            <input
              type="file"
              accept="application/pdf"
              @change="onFile"
              class="hidden"
            />
          </label>

          <p v-if="file" class="text-gray-700">
            📄 {{ file.name }}
          </p>

          <!-- Watermark Text -->
          <input
            v-model="watermarkText"
            type="text"
            placeholder="Watermark text (e.g. CONFIDENTIAL)"
            class="border rounded-xl px-4 py-3 w-full"
          />

          <!-- Options -->
          <div class="flex gap-4">
            <select v-model="position" class="border rounded-xl px-4 py-2 w-full">
              <option value="center">Center</option>
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
            </select>

            <input
              v-model.number="opacity"
              type="number"
              min="0.1"
              max="1"
              step="0.1"
              class="border rounded-xl px-4 py-2 w-32"
              placeholder="Opacity"
            />
          </div>

          <button
            @click="upload"
            :disabled="!file || !watermarkText"
            class="bg-gray-800 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            Add Watermark
          </button>

        </div>
      </div>

      <!-- RIGHT -->
      <div class="flex-1 bg-white rounded-2xl shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Files in Progress</h2>
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
const queue = ref([]);

const watermarkText = ref("");
const position = ref("center");
const opacity = ref(0.3);

const onFile = (e) => {
  file.value = e.target.files[0];
};

const toBase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
};

const upload = async () => {
  try {
    if (!file.value || !watermarkText.value) return;

    const pdf = await toBase64(file.value);

    await DocumentService.watermarkPdf({
      device_id: deviceId,
      device_address: address,
      pdf,
      watermark: {
        text: watermarkText.value,
        position: position.value,
        opacity: opacity.value
      }
    });

    file.value = null;
    watermarkText.value = "";
    await getList();

  } catch (e) {
    window.$alert(MESSAGES.SYSTEM.SERVER_ERROR.message, "error");
  }
};

const getList = async () => {
  const res = await DocumentService.getQueue("watermark_pdf", deviceId);
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
  } catch {
    window.$alert(MESSAGES.SYSTEM.DOWNLOAD_ERROR.message, "error");
  }
};

let intervalId;
onMounted(() => {
  getList();
  intervalId = setInterval(getList, 3000);
});

onUnmounted(() => clearInterval(intervalId));
</script>
