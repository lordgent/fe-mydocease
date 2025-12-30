<template>
  <div class="min-h-screen bg-white flex flex-col font-sans antialiased text-gray-900 overflow-x-hidden">
    
    <section class="bg-white border-b border-gray-100">
      <div class="max-w-5xl mx-auto px-6 py-20 md:py-32 text-center">
        <h1 class="text-6xl md:text-8xl font-black text-gray-900 mb-8 tracking-tighter italic">
          About.
        </h1>
        <p class="text-xl md:text-2xl font-bold text-gray-800 mb-6 tracking-tight">
          Simple tools for complex document tasks.
        </p>
        <p class="text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
          MyDocEase is a focused platform built to refine the way you interact with digital documents. 
          We prioritize utility, speed, and privacy above all else.
        </p>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-6 py-24 border-b border-gray-50">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div class="space-y-12">
          <div class="group">
            <h2 class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4 flex items-center gap-3">
              <span class="w-8 h-[2px] bg-gray-800 inline-block"></span> 01 / Our Mission
            </h2>
            <p class="text-2xl font-bold text-gray-800 leading-snug">
              To provide intuitive tools that handle digital files with zero friction and maximum reliability.
            </p>
          </div>

          <div class="group">
            <h2 class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4 flex items-center gap-3">
              <span class="w-8 h-[2px] bg-gray-800 inline-block"></span> 02 / Our Vision
            </h2>
            <p class="text-2xl font-bold text-gray-800 leading-snug">
              To become the standard for professional, browser-based document management for everyone.
            </p>
          </div>
        </div>

        <div class="flex justify-center lg:justify-end">
          <div class="relative">
            <div class="absolute -top-4 -right-4 w-full h-full border-4 border-gray-100 -z-10"></div>
            <img src="/icons/logo-v2.png" alt="MyDocEase Logo"
              class="w-48 h-48 md:w-64 md:h-64 object-contain grayscale opacity-80" />
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-24">
      <div class="max-w-6xl mx-auto px-6">
        <div class="mb-16 text-center md:text-left">
          <h2 class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Philosophy</h2>
          <h3 class="text-4xl font-black text-gray-900">Why MyDocEase.</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-1">
          <div v-for="item in whyUs" :key="item.title" 
            class="p-10 bg-white border border-gray-100 hover:border-gray-800 transition-all duration-300">
            <h4 class="text-xs font-black uppercase tracking-widest mb-4 text-gray-400">{{ item.title }}</h4>
            <p class="text-sm text-gray-600 leading-relaxed font-medium">
              {{ item.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>


  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const whyUs = [
  { 
    title: 'Intuitive UX', 
    desc: 'We remove the noise. A clean interface designed for direct action without unnecessary menus.' 
  },
  { 
    title: 'Direct Logic', 
    desc: 'Our workflow is linear. Upload, process, and download. No intermediate steps required.' 
  },
  { 
    title: 'Data Integrity', 
    desc: 'Files are treated with absolute privacy. We do not store your data beyond the active session.' 
  }
];
</script>

<style scoped>
/* Menghilangkan scrollbar pada elemen tertentu jika perlu */
::-moz-selection { background: #1f2937; color: white; }
::selection { background: #1f2937; color: white; }
</style>