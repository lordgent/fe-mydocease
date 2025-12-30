<template>
  <div class="min-h-screen bg-white flex flex-col font-sans antialiased text-gray-900 overflow-x-hidden">
    
    <section class="bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-28 text-center">
        <div class="inline-block px-3 py-1.5 mb-6 md:mb-10 text-[9px] md:text-[11px] font-black tracking-[0.2em] text-gray-800 uppercase border-2 border-gray-800 rounded">
          Status: Ready for processing
        </div>
        
        <h1 class="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-6 md:mb-8 tracking-tighter leading-none">
          MyDocEase.
        </h1>
        
        <p class="text-base sm:text-lg md:text-xl text-gray-700 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-medium px-4">
          Essential document tools built for speed and privacy. 
          Process your files securely without leaving your browser.
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 px-6">
          <button v-if="subscriptionData.trial_available" @click="startTrial"
            class="w-full sm:w-auto bg-gray-800 text-white font-black px-10 py-4 md:px-12 md:py-5 rounded-full hover:bg-black transition-all duration-300 uppercase text-[10px] md:text-xs tracking-widest">
            Start Free Trial
          </button>
          <a href="#tools"
            class="w-full sm:w-auto bg-white text-gray-900 border-2 border-gray-800 font-black px-10 py-4 md:px-12 md:py-5 rounded-full hover:bg-gray-50 transition-all text-[10px] md:text-xs uppercase tracking-widest text-center">
            Explore Tools
          </a>
        </div>
      </div>
    </section>

    <section id="tools" class="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
        <div class="text-left px-2">
          <h2 class="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Capabilities</h2>
          <h3 class="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Available Tools.</h3>
        </div>
        <p class="text-gray-600 font-medium text-sm max-w-xs border-l-4 border-gray-800 pl-4 md:text-right md:border-l-0 md:border-r-4 md:pr-4 md:ml-auto">
          All tools process files locally when possible. Your privacy is our default setting.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div v-for="tool in tools" :key="tool.title"
          class="group bg-white p-8 md:p-10 border-2 border-gray-200 hover:border-gray-900 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
          @click="goTo(tool.path)">
          <div class="mb-6 md:mb-8 opacity-40 group-hover:opacity-100 transition-opacity">
             <img :src="tool.icon" class="w-8 md:w-10 grayscale" />
          </div>
          <h3 class="text-xs md:text-sm font-black uppercase tracking-[0.1em] mb-3 md:mb-4 text-gray-900">
            {{ tool.title }}
          </h3>
          <p class="text-xs md:text-sm text-gray-600 leading-relaxed font-medium">
            {{ tool.desc }}
          </p>
        </div>
      </div>
    </section>

    <section class="bg-gray-800 py-20 md:py-28 text-white">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-gray-400 mb-16 md:mb-24 text-center">How it works</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div v-for="(step, index) in steps" :key="index" class="relative group">
            <div class="text-[70px] md:text-[100px] font-black text-white/10 absolute -top-12 md:-top-16 -left-2 md:-left-4 leading-none select-none group-hover:text-white/20 transition-colors">
              {{ index + 1 }}
            </div>
            <h4 class="text-base md:text-lg font-black uppercase tracking-widest mb-3 md:mb-4 relative z-10">{{ step.title }}</h4>
            <p class="text-gray-300 text-xs md:text-sm leading-relaxed relative z-10 font-medium">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <SubscriptionList 
      :show="isModalOpen" 
      bgColor="bg-gray-900" 
      @close="isModalOpen = false"
      @select="handlePlanSelection" 
      :allowTrial="true" 
    />
  </div>
</template>

<script setup>
import SubscriptionList from "@/components/SubscriptionList.vue";
import { ref, onMounted } from "vue";

const tools = [
  { title: 'Sign PDF', desc: 'Apply secure digital signatures to your PDF documents.', icon: '/icons/signed.png', path: '/editor/signed-pdf' },
  { title: 'Word to PDF', desc: 'Convert document formats while preserving layout integrity.', icon: '/icons/word-to-pdf.png', path: '/editor/word-to-pdf' },
  { title: 'Image to PDF', desc: 'Consolidate multiple image formats into a single PDF file.', icon: '/icons/img-to-pdf.png', path: '/editor/convert-image-pdf' },
  { title: 'Crop Utility', desc: 'Refine and adjust image dimensions with precision.', icon: '/icons/crop.png', path: '/editor/crop' },
  { title: 'Compression', desc: 'Optimize file size for efficient storage and sharing.', icon: '/icons/compress.png', path: '/editor/compress' },
];

const steps = [
  { title: 'Selection', desc: 'Select or drag your files into the secure browser interface.' },
  { title: 'Execution', desc: 'The engine processes your request using local optimization.' },
  { title: 'Retrieval', desc: 'Download your file. Data is purged immediately after session.' }
];

const token = localStorage.getItem("token");
const isModalOpen = ref(false);

const subscriptionData = ref({
  has_access: false,
  trial_available: false,
  status: 'none',
  days_left: 0
});

const checkStatus = async () => {
  if (!token) {
    subscriptionData.value.trial_available = true;
    return;
  }

  try {
    const res = await fetch(`http://localhost:8000/api/v1/status-subscription`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    const response = await res.json();
    if (response.success) {
      subscriptionData.value = response.subscription_data;
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

const goTo = (path) => {
  if (!token) {
    window.location.href = '/login';
  } else {
    window.location.href = path;
  }
};

const startTrial = () => {
  if (!token) {
    window.location.href = '/login';
  } else {
    isModalOpen.value = true;
  }
};

onMounted(() => {
  checkStatus();
});
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>