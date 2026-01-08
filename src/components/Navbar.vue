<template>
  <nav class="fixed top-0 left-0 w-full bg-white shadow-sm border-b border-gray-100 z-50">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">

        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center gap-2 group">
            <img src="/icons/logo-v2.png" alt="logo" class="w-9 transition-transform group-hover:scale-105">
            <span class="text-xl font-extrabold text-gray-800 tracking-tight">MyDocEase</span>
          </router-link>
        </div>

        <div class="hidden md:flex items-center space-x-8">
          
          <div v-if="isAuthenticated" class="flex items-center">
            <div 
              class="flex items-center gap-3 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200/60 shadow-sm hover:border-amber-200 hover:bg-white transition-all duration-300"
              title="Sisa limit harian Anda"
            >
              <div class="flex items-center justify-center w-6 h-6 bg-amber-100 rounded-full text-amber-600 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <div class="flex flex-col pr-1 leading-none">
                <span class="text-[9px] uppercase font-bold text-gray-400 tracking-widest mb-0.5">Usage Limit</span>
                <div class="flex items-baseline gap-1">
                  <span :class="['text-sm font-bold', remainingCount <= 3 ? 'text-red-500' : 'text-gray-700']">
                    {{ dailyLimit === 'unlimited' ? 'Unlimited' : remainingCount }}
                  </span>
                  <span v-if="dailyLimit !== 'unlimited'" class="text-[10px] text-gray-300 font-semibold">/ {{ dailyLimit }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-6">
            <router-link to="/about" class="text-sm font-semibold text-gray-600 hover:text-gray-900 transition">About</router-link>
            <router-link to="/contact" class="text-sm font-semibold text-gray-600 hover:text-gray-900 transition">Contact Us</router-link>
          </div>

          <div class="h-6 w-[1px] bg-gray-200"></div>

          <div v-if="!isAuthenticated" class="flex items-center space-x-3">
            <router-link to="/login"
              class="px-4 py-2 text-sm font-bold text-gray-700 hover:text-gray-900 transition">
              Login
            </router-link>
            <router-link to="/register"
              class="px-5 py-2 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-700 shadow-md transition transform active:scale-95">
              Register
            </router-link>
          </div>

          <div v-else class="relative group">
            <button class="flex items-center focus:outline-none p-1 rounded-full hover:bg-gray-100 transition">
              <img src="/icons/user.svg" alt="User" class="w-8 h-8 rounded-full border border-gray-200" />
            </button>

            <div class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right group-hover:translate-y-0 translate-y-2">
              <router-link to="/profile" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Profile
              </router-link>
              <hr class="my-1 border-gray-50">
              <button @click="handleLogout" class="flex items-center w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition font-medium">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Logout
              </button>
            </div>
          </div>

        </div>

        <div class="md:hidden">
          <button @click="open = !open" class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!open" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>
    </div>

    <transition name="fade">
      <div v-if="open" class="md:hidden bg-white border-t border-gray-100 pb-4 shadow-xl">
        <div v-if="isAuthenticated" class="p-4 bg-gray-50 flex items-center justify-between mb-2 mx-4 mt-4 rounded-xl border border-gray-100">
          <div class="flex items-center gap-3">
            <img src="/icons/user.svg" alt="User" class="w-10 h-10 border border-white shadow-sm rounded-full" />
            <span class="font-bold text-gray-800">My Profile</span>
          </div>
          <div class="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
            Limit: {{ dailyLimit === 'unlimited' ? '∞' : `${remainingCount}/${dailyLimit}` }}
          </div>
        </div>

        <div class="px-4 space-y-1">
          <router-link to="/about" class="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition">About</router-link>
          <router-link to="/contact" class="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition">Contact Us</router-link>
          <div v-if="isAuthenticated">
             <router-link to="/profile" class="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition">Profile Settings</router-link>
             <button @click="handleLogout" class="w-full text-left px-4 py-3 text-red-500 font-medium hover:bg-red-50 rounded-lg transition">Logout</button>
          </div>
        </div>

        <div v-if="!isAuthenticated" class="px-6 mt-4 flex flex-col gap-2">
          <router-link to="/login" class="w-full py-3 text-center border border-gray-300 rounded-xl font-bold text-gray-700">Login</router-link>
          <router-link to="/register" class="w-full py-3 text-center bg-gray-900 text-white rounded-xl font-bold shadow-lg">Register</router-link>
        </div>
      </div>
    </transition>
  </nav>

  <div class="h-16"></div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api"; // ganti sesuai path axios instance

const open = ref(false);
const router = useRouter();

const isAuthenticated = computed(() => !!localStorage.getItem("token"));
const user = ref(null);
const dailyLimit = ref(null);
const remainingCount = ref(0);

// Logout function
const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// Fetch user profile + daily limit
const fetchUserData = async () => {
  const token = localStorage.getItem("token");
  if (!token) return router.push("/login");

  try {
    const res = await api.get("/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    user.value = res.data.user;
    dailyLimit.value = res.data.daily_limit;

    if (!res.data.remaining || Object.keys(res.data.remaining).length === 0) {
      remainingCount.value = dailyLimit.value; // belum pakai
    } else {
      remainingCount.value = Object.values(res.data.remaining)[0]; // ambil value pertama
    }

  } catch (err) {
    console.error("User fetch error:", err);
    if (err.response?.status === 401) router.push("/login");
  }
};

onMounted(() => {
  if (isAuthenticated.value) fetchUserData();
});
</script>


<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
