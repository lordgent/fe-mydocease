<template>
  <div class="mt-6">
    <h2 class="font-semibold mb-2">Crop Your Image Here</h2>

    <div class="w-full">
      <img ref="imageRef" :src="image" class="max-w-full" />
    </div>

    <button
      @click="cropImage"
      :disabled="isLoading"
      class="mt-3 px-4 w-full py-2 bg-gray-800 text-white rounded flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <!-- Spinner -->
      <svg
        v-if="isLoading"
        class="w-5 h-5 animate-spin"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>

      <span>{{ isLoading ? "Cropping..." : "Crop" }}</span>
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

const props = defineProps({
  image: String,
});

const emit = defineEmits(["cropped"]);

const imageRef = ref(null);
const isLoading = ref(false);
let cropper = null;

watch(
  () => props.image,
  () => initCropper()
);

onMounted(() => initCropper());

const initCropper = () => {
  if (!imageRef.value) return;

  if (cropper) cropper.destroy();

  cropper = new Cropper(imageRef.value, {
    aspectRatio: NaN,
    viewMode: 1,
    movable: true,
    zoomable: true,
    scalable: true,
    autoCropArea: 0.8,
  });
};

const cropImage = async () => {
  isLoading.value = true;

  await new Promise((resolve) => setTimeout(resolve, 350)); // efek loading sedikit

  const canvas = cropper.getCroppedCanvas();
  const base64 = canvas.toDataURL("image/png");
  emit("cropped", base64);

  isLoading.value = false;
};
</script>
