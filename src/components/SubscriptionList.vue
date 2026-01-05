<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/70 p-4"
      @click.self="$emit('close')"
    >
      <div
        class="relative bg-white text-gray-800 rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden w-full max-w-4xl max-h-[90vh]"
      >
        <div class="p-6 md:p-8 pb-0 bg-white z-10">
          <button 
            @click="$emit('close')" 
            class="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 class="text-xl md:text-3xl font-black uppercase tracking-tight pr-10">Choose Your Plan</h2>
          <p class="text-gray-500 text-xs md:text-sm mt-2">Pick a plan that fits you and get started boosting your workflow today.</p>
        </div>

        <div class="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div v-if="loading" class="py-20 text-center">
            <div class="animate-spin inline-block w-10 h-10 border-4 border-gray-800 border-t-transparent rounded-full mb-4"></div>
            <p class="text-gray-500 font-medium">Processing data...</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="plan in plans" 
              :key="plan.id"
              @click="selectPlan(plan)"
              :class="[
                'flex flex-col justify-between p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden',
                selectedPlan?.id === plan.id 
                  ? 'border-gray-800 bg-gray-800 text-white ring-4 ring-gray-100' 
                  : 'border-gray-100 bg-gray-50 hover:border-gray-300 text-gray-800'
              ]"
            >
              <div class="relative z-10">
                <div class="flex justify-between items-center mb-4">
                  <span :class="[
                    'px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest',
                    selectedPlan?.id === plan.id ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'
                  ]">
                    {{ plan.duration_days }} Days
                  </span>
                  
                  <div v-if="selectedPlan?.id === plan.id" class="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <h3 class="text-lg font-bold mb-1 truncate">{{ plan.name }}</h3>
                <p :class="['text-2xl font-black mb-4', selectedPlan?.id === plan.id ? 'text-white' : 'text-gray-900']">
                  {{ formatPrice(plan.price) }}
                </p>

                <div :class="['pt-4 border-t', selectedPlan?.id === plan.id ? 'border-white/20' : 'border-gray-200']">
                  <ul class="text-[12px] space-y-3">
                    <li class="flex items-center gap-2">
                      <span class="text-emerald-500 font-bold">✔</span> 
                      <span>{{ plan.duration_days }} days access</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="text-emerald-500 font-bold">✔</span> 
                      <span>Full Feature Access</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="text-emerald-500 font-bold">✔</span> 
                      <span>Priority Support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 md:p-8 pt-4 bg-gray-50/50 border-t border-gray-100 text-center">
          <button 
            class="w-full md:w-80 bg-gray-900 hover:bg-black text-white font-black py-4 rounded-2xl transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed shadow-2xl shadow-gray-200 uppercase tracking-widest text-sm"
            :disabled="!selectedPlan || loading"
            @click="confirmSubscription"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Processing...
            </span>
            <span v-else>Proceed to Payment</span>
          </button>
          <div class="mt-4 flex items-center justify-center gap-4">
             <p class="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-1">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>
               Secure Checkout
             </p>
             <span class="text-gray-300 text-[10px]">•</span>
             <p class="text-[10px] text-gray-400 uppercase tracking-widest">No Hidden Fees</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>


<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
const apiUrl = import.meta.env.VITE_API_URL

const props = defineProps({
  show: Boolean,
  bgColor: {
    type: String,
    default: 'bg-white'
  },
  allowTrial: {
    type: Boolean,
    default: false
  },
});

const emit = defineEmits(['close', 'select']);

const plans = ref([]);
const loading = ref(true);
const selectedPlan = ref(null);

const fetchPlans = async () => {
  loading.value = true;
  try {
    const res = await fetch(`${apiUrl}/v1/subscriptions`);
    const responseData = await res.json(); 
    plans.value = responseData.data || responseData; 
  } catch (error) {
    console.error("Gagal memuat data:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPlans();
});

const selectPlan = (plan) => {
  selectedPlan.value = plan;
};

const formatPrice = (price) => {
  if (price === 0) return 'GRATIS';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

const confirmSubscription = async () => {
  if (!selectedPlan.value) return;

  loading.value = true;

  try {
    const response = await fetch(`${apiUrl}/v1/subscription/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({
        subscription_package_id: selectedPlan.value.id
      })
    });

    const result = await response.json();
    if (result.success && result.data.redirect_url) {
        window.location.href = result.data.redirect_url;
    } else {
        window.$alert("Terjadi kesalahan sistem saat menghubungi server.", "error");
        loading.value = false;
    }

  } catch (error) {
    window.$alert("Terjadi kesalahan sistem saat menghubungi server.", "error");
    loading.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>