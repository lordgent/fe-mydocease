<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    
    <section class="bg-white border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-6 py-20 text-center">
        <div class="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-indigo-600 uppercase bg-indigo-50 rounded-full">
          New: Powered Document Tools
        </div>
        <h1 class="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
          MyDocEase
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Effortless & Intelligent Document Management. Organize, convert, and secure your files with our next-generation browser tools.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <button @click="startTrial"
            class="bg-indigo-600 text-white font-bold px-10 py-4 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-200 transition-all duration-300 transform hover:-translate-y-1">
            Start Free Trial
          </button>
          <a href="#tools" class="bg-white text-gray-700 border border-gray-200 font-bold px-10 py-4 rounded-xl hover:bg-gray-50 transition-all">
            Explore Tools
          </a>
        </div>
      </div>
    </section>

    <section class="bg-white border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-6 py-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p class="text-3xl font-bold text-gray-900">0.5s</p>
            <p class="text-gray-500 text-sm">Processing Speed</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-gray-900">100%</p>
            <p class="text-gray-500 text-sm">Privacy Secured</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-gray-900">256-bit</p>
            <p class="text-gray-500 text-sm">AES Encryption</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-gray-900">Zero</p>
            <p class="text-gray-500 text-sm">Files Stored</p>
          </div>
        </div>
      </div>
    </section>

    <section id="tools" class="max-w-6xl mx-auto px-6 py-20">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-4">Powerful File Tools</h2>
        <p class="text-gray-600 max-w-xl mx-auto">Everything you need to manage your documents in one place, without installing any software.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 cursor-pointer"
          @click="goTo('/editor/signed-pdf')">
          <div class="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <img src="/icons/signed.png" class="w-10 opacity-90" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600">Sign PDF</h3>
          <p class="text-gray-500 text-sm leading-relaxed">Add digital signatures to your documents securely using our encrypted signing tool.</p>
        </div>

        <div class="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 cursor-pointer"
          @click="goTo('/editor/word-to-pdf')">
          <div class="w-16 h-16 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <img src="/icons/word-to-pdf.png" class="w-10 opacity-90" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600">Word to PDF</h3>
          <p class="text-gray-500 text-sm leading-relaxed">Convert .docx to high-quality PDF files while maintaining original fonts and layouts.</p>
        </div>

        <div class="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 cursor-pointer"
          @click="goTo('/editor/convert-image-pdf')">
          <div class="w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <img src="/icons/img-to-pdf.png" class="w-10 opacity-90" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600">Image to PDF</h3>
          <p class="text-gray-500 text-sm leading-relaxed">Merge multiple JPG, PNG, or TIFF images into a single, organized PDF document.</p>
        </div>

        <div class="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 cursor-pointer" @click="goTo('/editor/crop')">
          <div class="w-16 h-16 bg-yellow-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <img src="/icons/crop.png" class="w-10 opacity-90" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600">Crop Image</h3>
          <p class="text-gray-500 text-sm leading-relaxed">Smart cropping tool to resize and focus on the important parts of your images.</p>
        </div>

        <div class="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 cursor-pointer"
          @click="goTo('/editor/compress')">
          <div class="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <img src="/icons/compress.png" class="w-10 opacity-90" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600">Compress Image</h3>
          <p class="text-gray-500 text-sm leading-relaxed">Reduce file size up to 90% without losing visible quality for faster web loading.</p>
        </div>
      </div>
    </section>

    <section class="bg-gray-100 py-20">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-16 text-gray-900">Simple 3-Step Process</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div class="text-center">
            <div class="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg shadow-indigo-200">1</div>
            <h4 class="text-lg font-bold mb-3">Upload Document</h4>
            <p class="text-gray-600">Drag and drop your files into our secure browser-based uploader.</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg shadow-indigo-200">2</div>
            <h4 class="text-lg font-bold mb-3">Process Instantly</h4>
            <p class="text-gray-600">Our servers handle the heavy lifting using advanced optimization algorithms.</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg shadow-indigo-200">3</div>
            <h4 class="text-lg font-bold mb-3">Download & Save</h4>
            <p class="text-gray-600">Your file is ready. We automatically delete your data for your security.</p>
          </div>
        </div>
      </div>
    </section>



    <SubscriptionList 
      :show="isModalOpen" 
      bgColor="bg-slate-900" 
      @close="isModalOpen = false"
      @select="handlePlanSelection" 
      :allowTrial="true" 
    />
  </div>
</template>

<script setup>
import SubscriptionList from "@/components/SubscriptionList.vue";
import { ref, onMounted } from "vue";

const token = localStorage.getItem("token");
const isModalOpen = ref(false);
const isTrial = ref(0);

// API CALL: Check trial status
const checkTrial = async () => {
  if (!token) return;
  try {
    const res = await fetch(`http://localhost:8000/api/v1/status-trial`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    const response = await res.json();
    isTrial.value = response.trial ? 1 : 0;
  } catch (err) {
    console.error("Failed to fetch trial status:", err);
    isTrial.value = 0;
  }
};

// NAVIGATION LOGIC
const goTo = (path) => {
  if (!token) {
    window.location.href = '/login';
  } else if (isTrial.value > 0) {
    window.location.href = path;
  } else {
    isModalOpen.value = true;
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
  checkTrial();
});
</script>

<style scoped>
/* Optional: Smooth scrolling for the whole page */
html {
  scroll-behavior: smooth;
}
</style>