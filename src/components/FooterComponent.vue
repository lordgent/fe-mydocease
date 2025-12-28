
<template>
  <footer class="bg-gray-900 text-gray-200 mt-auto">
    <div class="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">

      <!-- Branding -->
      <div class="flex flex-col items-center md:items-start">
        <h2 class="text-2xl font-bold text-white mb-2">MyDocEase</h2>
      <p class="text-gray-400 text-sm">
      Powerful, efficient, and dependable tools to manage, 
      convert, and optimize your files online — all from a secure and intuitive platform.
    </p>

      </div>

      <!-- Quick Links -->
      <div class="flex flex-col items-center">
        <h3 class="text-white font-semibold mb-2">Quick Links</h3>
        <router-link to="/" class="text-gray-400 hover:text-white mb-1 transition">Home</router-link>
        <router-link to="/about" class="text-gray-400 hover:text-white mb-1 transition">About</router-link>
        <router-link to="/contact" class="text-gray-400 hover:text-white mb-1 transition">Contact</router-link>
      </div>

      <!-- Social Media -->
      <div class="flex flex-col items-center md:items-end">
        <h3 class="text-white font-semibold mb-2">Follow Us</h3>
        <div class="flex space-x-4">
          <a href="#" class="text-gray-400 hover:text-white transition">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="#" class="text-gray-400 hover:text-white transition">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="#" class="text-gray-400 hover:text-white transition">
            <i class="fab fa-instagram"></i>
          </a>
        </div>
      </div>

    </div>

    <div class="border-t border-gray-700 mt-6 py-4 text-center text-gray-400 text-sm">
      &copy; {{ new Date().getFullYear() }} MyDocEase. All rights reserved.
    </div>
  </footer>
</template>

<script setup>
</script>
