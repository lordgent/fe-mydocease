<template>
  <nav class="fixed top-0 left-0 w-full bg-white shadow-md z-50">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">

        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="text-xl flex items-center font-extrabold text-gray-800">
            <img src="/icons/logo-v2.png" alt="logo" class="w-10">
            <p>MyDocEase</p>
          </router-link>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex space-x-6 items-center">
          <router-link to="/about" class="text-gray-700 font-medium hover:text-gray-900">About</router-link>

          <router-link to="/contact" class="text-gray-700 font-medium hover:text-gray-900">Contact Us</router-link>

          <div v-if="!isAuthenticated" class="flex items-center space-x-3">
            <router-link to="/login"
              class="px-4 py-2 border border-gray-800 rounded-lg text-gray-800 hover:bg-gray-800 hover:text-white transition">
              Login
            </router-link>

            <router-link to="/register"
              class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
              Register
            </router-link>
          </div>

          <div v-else class="relative group">
            <!-- User Icon -->
            <button class="flex items-center focus:outline-none">
              <img src="/icons/user.svg" alt="User" class="w-8 h-8" />
            </button>

            <!-- Dropdown -->
            <div class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg opacity-0 invisible
           group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <router-link to="/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Profile
              </router-link>

              <button @click="handleLogout" class="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                Logout
              </button>
            </div>
          </div>

        </div>

        <!-- Mobile Button -->
        <div class="md:hidden">
          <button @click="open = !open" class="text-gray-700">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!open" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="open" class="md:hidden bg-white shadow-md">
      <div v-if="isAuthenticated">
        <router-link to="/profile" class="block px-4 py-2">Profile</router-link>
      </div>
      <router-link to="/about" class="block px-4 py-2">About</router-link>
      <router-link to="/contact" class="block px-4 py-2">Contact Us</router-link>

      <div v-if="!isAuthenticated" class="p-2 flex gap-2 ">
      <router-link to="/login"
              class="px-4 py-2 border border-gray-800 rounded-lg text-gray-800 hover:bg-gray-800 hover:text-white transition">
              Login
            </router-link>

            <router-link to="/register"
              class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
              Register
            </router-link>
      </div>

      <div v-else class="px-4 py-2">
        <button @click="handleLogout" class="text-red-500">Logout</button>
      </div>
    </div>
  </nav>

  <div class="h-16"></div>
</template>


<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const open = ref(false);
const router = useRouter();

const isAuthenticated = computed(() => {
  return !!localStorage.getItem("token");
});

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href ="/login";
};
</script>
