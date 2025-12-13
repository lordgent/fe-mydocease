<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- HERO / ABOUT HEADER -->
    <section class="bg-white shadow-md">
      <div class="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 class="text-5xl font-extrabold text-gray-800 mb-4">About MyDocEase</h1>
        <p class="text-xl text-gray-600 mb-6">
          Simplifying file management for everyone
        </p>
        <p class="text-gray-500 mb-8">
          MyDocEase is a modern web platform that allows you to compress, crop, and edit files easily. Our mission is to
          make file optimization and editing **fast, secure, and accessible** to everyone — whether it’s images, PDFs,
          or documents.
        </p>
      </div>
    </section>

    <!-- MISSION & VISION SECTION -->
    <section class="max-w-5xl mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p class="text-gray-600 mb-6">
            To simplify digital file management by providing easy-to-use tools that help users **compress, crop, and
            edit files** efficiently without compromising quality.
          </p>
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
          <p class="text-gray-600">
            To become the go-to platform for **all file editing needs**, empowering individuals and businesses to handle
            documents, images, and PDFs effortlessly online.
          </p>
        </div>
        <div class="flex justify-center">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Mission Vision"
            class="w-80 h-80 object-contain" />
        </div>
      </div>
    </section>

    <!-- FEATURES / WHY CHOOSE US -->
    <section class="bg-gray-50 py-16">
      <div class="max-w-5xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-10">Why Choose MyDocEase?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
            <img src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" class="w-16 mx-auto mb-4 opacity-80" />
            <h3 class="text-xl font-semibold mb-2">Easy to Use</h3>
            <p class="text-gray-500 text-sm">
              Intuitive interface that allows you to edit files in seconds without any technical skills.
            </p>
          </div>
          <div class="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
            <img src="https://cdn-icons-png.flaticon.com/512/1828/1828665.png" class="w-16 mx-auto mb-4 opacity-80" />
            <h3 class="text-xl font-semibold mb-2">Fast & Efficient</h3>
            <p class="text-gray-500 text-sm">
              Compress, crop, or edit files quickly while maintaining high quality.
            </p>
          </div>
          <div class="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
            <img src="https://cdn-icons-png.flaticon.com/512/565/565547.png" class="w-16 mx-auto mb-4 opacity-80" />
            <h3 class="text-xl font-semibold mb-2">Secure & Reliable</h3>
            <p class="text-gray-500 text-sm">
              Your files are processed securely in your browser, no unnecessary uploads or storage.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- TEAM SECTION (Optional) -->
    <section class="max-w-5xl mx-auto px-6 py-16">
      <h2 class="text-3xl font-bold text-gray-800 text-center mb-10">Meet the Team</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <img src="https://cdn-icons-png.flaticon.com/512/219/219983.png"
            class="w-32 h-32 rounded-full mx-auto mb-4" />
          <h3 class="text-xl font-semibold">Jane Doe</h3>
          <p class="text-gray-500 text-sm">Founder & CEO</p>
        </div>
        <div>
          <img src="https://cdn-icons-png.flaticon.com/512/219/219986.png"
            class="w-32 h-32 rounded-full mx-auto mb-4" />
          <h3 class="text-xl font-semibold">John Smith</h3>
          <p class="text-gray-500 text-sm">Lead Developer</p>
        </div>
        <div>
          <img src="https://cdn-icons-png.flaticon.com/512/219/219980.png"
            class="w-32 h-32 rounded-full mx-auto mb-4" />
          <h3 class="text-xl font-semibold">Emily Lee</h3>
          <p class="text-gray-500 text-sm">UI/UX Designer</p>
        </div>
      </div>
    </section>


  </div>
</template>

<script>
export default {
  name: "About",
};
</script>
