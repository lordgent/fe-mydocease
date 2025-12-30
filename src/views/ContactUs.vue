<template>
  <div class="min-h-screen bg-white flex flex-col font-sans antialiased text-gray-900 overflow-x-hidden">

    <section class="bg-white border-b-2 border-gray-900">
      <div class="max-w-7xl mx-auto px-6 py-20 md:py-32 text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div class="max-w-2xl">
          <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-6 italic">Contact.</h1>
          <p class="text-xl font-bold text-gray-800 tracking-tight">
            Tell us how we can improve.
          </p>
        </div>
        <div class="text-gray-400 text-[10px] font-black uppercase tracking-[0.5em] pb-2">
          Feedback / Support / Inquiry
        </div>
      </div>
    </section>

    <section class="max-w-5xl w-full mx-auto px-6 py-16 md:py-24">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        <div class="lg:col-span-4 space-y-12">
          <div>
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Direct Channel</h3>
            <p class="text-sm font-bold text-gray-800">mydocease@gmail.com</p>
          </div>
          <div>
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Inquiry Response</h3>
            <p class="text-sm text-gray-600 font-medium leading-relaxed">
              Our system processes inquiries within 24 standard operating hours.
            </p>
          </div>
        </div>

        <form @submit.prevent="submitForm" class="lg:col-span-8 space-y-10">
          
          <div class="space-y-4">
            <label class="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-800" for="email">
              Email Address
            </label>
            <input 
              v-model="email" type="email" id="email" placeholder="YOUR@EMAIL.COM" required
              class="w-full px-0 py-4 bg-transparent border-b-2 border-gray-200 focus:border-gray-900 outline-none transition-colors text-lg font-bold placeholder:text-gray-200" 
            />
          </div>

          <div class="space-y-4">
            <label class="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-800" for="message">
              Message
            </label>
            <textarea 
              v-model="message" id="message" placeholder="DESCRIBE YOUR INQUIRY OR FEEDBACK..." rows="5" required
              class="w-full px-0 py-4 bg-transparent border-b-2 border-gray-200 focus:border-gray-900 outline-none transition-colors text-lg font-bold placeholder:text-gray-200 resize-none"
            ></textarea>
          </div>

          <div class="pt-6">
            <button type="submit"
              class="group relative inline-flex items-center justify-center px-12 py-4 font-black text-white bg-gray-800 hover:bg-black transition-all w-full md:w-auto uppercase text-xs tracking-[0.2em]">
              Send Message
            </button>
          </div>

          <transition name="fade">
            <div v-if="successMessage" class="p-6 border-2 border-gray-800 bg-gray-50 text-xs font-black uppercase tracking-widest text-center italic">
              {{ successMessage }}
            </div>
          </transition>
          <transition name="fade">
            <div v-if="errorMessage" class="p-6 border-2 border-red-200 text-red-500 text-xs font-black uppercase tracking-widest text-center italic">
              {{ errorMessage }}
            </div>
          </transition>
          
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref("");
const message = ref("");
const successMessage = ref("");
const errorMessage = ref("");

const submitForm = () => {
  if (email.value && message.value) {
    errorMessage.value = "";
    successMessage.value = "Transmission successful. Thank you for your feedback.";
    
    // Reset form
    const tempEmail = email.value;
    email.value = "";
    message.value = "";
    
    // Clear message after 5 seconds
    setTimeout(() => {
      successMessage.value = "";
    }, 5000);
  } else {
    errorMessage.value = "Execution failed. Please populate all required fields.";
    successMessage.value = "";
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Custom underline focus effect */
input:focus, textarea:focus {
  transform: translateY(-2px);
}
</style>