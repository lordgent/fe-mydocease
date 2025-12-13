<template>
  <nav class="fixed top-0 left-0 w-full bg-white shadow-md z-50">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">

        <!-- Logo / Brand -->
        <div class="flex-shrink-0">
          <router-link to="/" class="text-xl font-extrabold text-gray-800">
            MyDocEase
          </router-link>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex space-x-6">
          <router-link 
            to="/about" 
            class="text-gray-700 hover:text-gray-700 font-medium"
            active-class="text-gray-700"
          >About</router-link>
          <router-link 
            to="/contact" 
            class="text-gray-700 hover:text-gray-700 font-medium"
            active-class="text-gray-700"
          >Contact Us</router-link>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button @click="open = !open" class="text-gray-700 focus:outline-none">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!open" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="open" class="md:hidden bg-white shadow-md">
      <router-link 
        to="/about" 
        class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
      >About</router-link>
      <router-link 
        to="/contact" 
        class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
      >Contact Us</router-link>
    </div>
  </nav>

  <!-- Spacer untuk navbar fixed -->
  <div class="h-16 md:h-16"></div>
</template>

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>
