<template>
  <div class="min-h-screen bg-white flex flex-col font-sans antialiased text-gray-900 overflow-x-hidden">

    <section class="bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-28 text-center">
        <div v-if="isAuthenticated && subscriptionData.status === 'active'"
          class="inline-block px-4 py-1.5 mb-6 md:mb-10 text-[10px] font-black tracking-[0.1em] text-amber-700 bg-amber-50 border border-amber-200 rounded-full uppercase">
          ✨ Premium Member Plan
        </div>
        <div v-else
          class="inline-block px-3 py-1.5 mb-6 md:mb-10 text-[9px] md:text-[11px] font-black tracking-[0.2em] text-gray-800 uppercase border-2 border-gray-800 rounded">
          Ready for processing
        </div>

        <h1
          class="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-6 md:mb-8 tracking-tighter leading-none">
          MyDocEase.
        </h1>

        <p
          class="text-base sm:text-lg md:text-xl text-gray-700 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-medium px-4">
          Essential document tools built for speed and privacy.
          Process your files securely without leaving your browser.
        </p>

        <div class="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 px-6">
          
        <button
          v-if="subscriptionData.status !== 'active'"
          @click="handleUpgradeClick"
          class="w-full sm:w-auto bg-gray-900 text-white font-black px-10 py-4 md:px-12 md:py-5 rounded-full hover:bg-black transition-all duration-300 uppercase text-[10px] md:text-xs tracking-widest flex flex-col items-center"
        >
          <span>Upgrade for Unlimited</span>
        </button>


          <div v-else class="w-full sm:w-auto px-10 py-4 md:px-12 md:py-5 rounded-full bg-green-50 border-2 border-green-500 text-green-700 font-black text-[10px] md:text-xs uppercase tracking-widest">
            Unlimited Access Active
          </div>

          <a href="#tools"
            class="w-full sm:w-auto bg-white text-gray-900 border-2 border-gray-800 font-black px-10 py-4 md:px-12 md:py-5 rounded-full hover:bg-gray-50 transition-all text-[10px] md:text-xs uppercase tracking-widest text-center flex items-center justify-center">
            Explore Tools
          </a>
        </div>

        <div v-if="subscriptionData.status !== 'active'" class="mt-8 flex justify-center items-center gap-2">
           <span class="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
           <p class="text-xs font-bold text-gray-500 uppercase tracking-tighter">
             {{ !token ? 'Free users are limited to 3 tasks per day' : 'Daily limit active for your account' }}
           </p>
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
          <div class="mb-6 md:mb-8 opacity-40 group-hover:opacity-100 transition-opacity text-2xl">
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

    <SubscriptionList 
      :show="isModalOpen" 
      bgColor="bg-white" 
      @close="isModalOpen = false"
      @select="handlePlanSelection" 
      :allowTrial="false" 
    />
  </div>
</template>

<script setup>
import SubscriptionList from "@/components/SubscriptionList.vue";
import { ref, onMounted, computed } from "vue";
const apiUrl = import.meta.env.VITE_API_URL

const tools = [
  { title: 'Merge PDF', desc: 'Combine multiple PDFs into one unified document.', icon: '/icons/merge-pdf.png', path: '/editor/merge-pdf' },
  { title: 'Protect PDF', desc: 'Secure your documents with a password to prevent unauthorized access.', icon: '/icons/password-pdf.png', path: '/editor/security-pdf' },
  { title: 'Sign PDF', desc: 'Apply secure digital signatures to your PDF documents.', icon: '/icons/signed.png', path: '/editor/signed-pdf' },
  { title: 'Word to PDF', desc: 'Convert document formats while preserving layout integrity.', icon: '/icons/word-to-pdf.png', path: '/editor/word-to-pdf' },
  { 
    title: 'Watermark PDF', 
    desc: 'Add text or image watermark to protect and brand your PDF documents.', 
    icon: '/icons/watermark_pdf.png', 
    path: '/editor/watermark-pdf' 
  },
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
const isAuthenticated = computed(() => !!token);
const isModalOpen = ref(false);

const subscriptionData = ref({
  has_access: false,
  status: 'none',
  days_left: 0
});

const handleUpgradeClick = () => {
  if (!token) {
    window.location.href = '/login';
    return;
  }
  isModalOpen.value = true;
};


const checkStatus = async () => {
  if (!token) return;

  try {
    const res = await fetch(`${apiUrl}/v1/status-subscription`, {
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

onMounted(() => {
  checkStatus();
});
</script>