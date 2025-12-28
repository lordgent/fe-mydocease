<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">

    <!-- HERO / ABOUT HEADER -->
    <section class="bg-white shadow-md">
      <div class="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 class="text-5xl font-extrabold text-gray-800 mb-4">
          About MyDocEase
        </h1>
        <p class="text-xl text-gray-600 mb-6">
          Effortless File Management, Made Simple
        </p>
        <p class="text-gray-500 max-w-3xl mx-auto">
          MyDocEase is a web-based platform that streamlines the way you manage and work with digital files. Built for
          simplicity,
          reliability, and a seamless user experience, it makes everyday file tasks faster and easier.
        </p>
      </div>
    </section>

    <!-- MISSION & VISION -->
    <section class="max-w-5xl mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p class="text-gray-600 mb-6">
            Empowering users to manage their digital files effortlessly through intuitive, reliable, and practical tools
          </p>

          <h2 class="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
          <p class="text-gray-600">
            To be the go-to platform where handling documents and files is seamless, efficient, and accessible for
            everyone.
          </p>
        </div>

        <div class="flex justify-center">
          <img src="/icons/logo-v2.png" alt="File Management Illustration"
            class="w-120 h-120 object-contain opacity-90" />
        </div>
      </div>
    </section>

    <!-- WHY CHOOSE US -->
    <section class="bg-gray-50 py-16">
      <div class="max-w-5xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-10">
          Why Choose MyDocEase?
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
            <img src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" class="w-16 mx-auto mb-4 opacity-80" />
            <h3 class="text-xl font-semibold mb-2">Easy to Use</h3>
            <p class="text-gray-500 text-sm">
              A clean and intuitive interface that makes working with files simple
              and straightforward.
            </p>
          </div>

          <div class="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
            <img src="https://cdn-icons-png.flaticon.com/512/1828/1828665.png" class="w-16 mx-auto mb-4 opacity-80" />
            <h3 class="text-xl font-semibold mb-2">Efficient Workflow</h3>
            <p class="text-gray-500 text-sm">
              Designed to help you complete file-related tasks quickly and
              without unnecessary steps.
            </p>
          </div>

          <div class="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
            <img src="https://cdn-icons-png.flaticon.com/512/565/565547.png" class="w-16 mx-auto mb-4 opacity-80" />
            <h3 class="text-xl font-semibold mb-2">Safe & Reliable</h3>
            <p class="text-gray-500 text-sm">
              Your files are handled with care, focusing on privacy,
              stability, and reliability.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- DEVELOPER -->
    <section class="max-w-5xl mx-auto px-6 py-16 text-center">
      <h2 class="text-3xl font-bold text-gray-800 mb-6">
        Developer
      </h2>

      <div class="flex flex-col items-center">
        <img src="https://cdn-icons-png.flaticon.com/512/219/219983.png" class="w-32 h-32 rounded-full mb-4" />
        <h3 class="text-2xl font-semibold">Lorem Ipsum</h3>
        <p class="text-gray-500 text-sm">
          Creator & Engineer of MyDocEase
        </p>
      </div>

    </section>

  </div>
</template>

<script>
export default {
  name: "About",
};
</script>
