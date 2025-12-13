<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- HERO SECTION -->
    <section class="bg-white shadow-md">
      <div class="max-w-5xl mx-auto px-6 py-16 text-center">
        <!-- Title -->
        <h1 class="text-5xl font-extrabold text-gray-800 mb-4">MyDocEase</h1>

        <!-- Subtitle -->
        <p class="text-xl text-gray-600 mb-6">
          Edit and optimize your files quickly and effortlessly
        </p>

        <!-- Description -->
        <p class="text-gray-500 mb-8">
          Compress, crop, and edit your documents within seconds—while maintaining high quality.
          Simple, fast, and secure file processing directly in your browser.
        </p>
      </div>
    </section>

    <!-- FEATURE SECTION -->
    <section class="max-w-5xl mx-auto px-6 py-16">
      <h2 class="text-3xl font-bold text-gray-800 text-center mb-10">
        File Tools
      </h2>
      <p class="text-center text-gray-600 mb-10">
        Choose the type of editor you want to use
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <!-- CROP IMAGE -->
        <div class="rounded-xl p-6 hover:shadow-xl cursor-pointer transition bg-gray-50"
          @click="$router.push('/editor/crop')">
          <img src="/icons/crop.png" class="w-32 mx-auto mb-4 opacity-80" />
          <h3 class="text-xl font-semibold text-center mb-2">Crop Image</h3>
          <p class="text-center text-gray-500 text-sm">
            Crop your images to the exact area you want.
          </p>
        </div>

        <!-- COMPRESS IMAGE -->
        <div class="rounded-xl p-6 hover:shadow-xl cursor-pointer transition bg-gray-50"
          @click="$router.push('/editor/compress')">
          <img src="/icons/compress.png" class="w-32 mx-auto mb-4 opacity-80" />
          <h3 class="text-xl font-semibold text-center mb-2">Compress Image</h3>
          <p class="text-center text-gray-500 text-sm">
            Make your images smaller and faster to load without sacrificing quality.
          </p>
        </div>

        <!-- CONVERT IMAGE TO PDF -->
        <div class="rounded-xl p-6 hover:shadow-xl cursor-pointer transition bg-gray-50"
          @click="$router.push('/editor/convert-image-pdf')">
          <img src="/icons/img-to-pdf.png" class="w-32 mx-auto mb-4 opacity-80" />
          <h3 class="text-xl font-semibold text-center mb-2">Image to PDF</h3>
          <p class="text-center text-gray-500 text-sm">
            Convert your images into high-quality PDF files instantly.
          </p>
        </div>

        <div class="rounded-xl p-6 hover:shadow-xl cursor-pointer transition bg-gray-50"
          @click="$router.push('/editor/signed-pdf')">
          <img src="/icons/signed.png" class="w-32 mx-auto mb-4 opacity-80" />
          <h3 class="text-xl font-semibold text-center mb-2">Signed PDF</h3>
          <p class="text-center text-gray-500 text-sm">
            Sign your PDF documents easily with a digital signature.
          </p>
        </div>


      </div>

    </section>

    <!-- SAMPLE FILES SECTION -->
    <section class="max-w-5xl mx-auto px-6 py-16">
      <h2 class="text-3xl font-bold text-gray-800 text-center mb-10">
        Sample Files
      </h2>
      <p class="text-center text-gray-600 mb-10">
        Preview the types of files you can edit using MyDocEase.
      </p>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <!-- Placeholder files -->
        <div class="bg-gray-200 rounded-lg h-40 flex items-center justify-center text-gray-400">
          File 1
        </div>
        <div class="bg-gray-200 rounded-lg h-40 flex items-center justify-center text-gray-400">
          File 2
        </div>
        <div class="bg-gray-200 rounded-lg h-40 flex items-center justify-center text-gray-400">
          File 3
        </div>
        <div class="bg-gray-200 rounded-lg h-40 flex items-center justify-center text-gray-400">
          File 4
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getDeviceInfo } from "../utils/DeviceInfo";

export default {
  name: "Home",
  mounted() {
    const { deviceId, address } = getDeviceInfo();

    console.log("Device ID:", deviceId);
    console.log("Device Address:", address);
  },
};
</script>
