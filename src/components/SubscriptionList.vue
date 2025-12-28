<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60"
      @click.self="$emit('close')"
    >
      <div
        class="relative bg-white text-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200"
        style="width: 95%; max-width: 900px;" 
      >
        <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 class="text-2xl font-black mb-1 uppercase tracking-tight">Choose Your Subscription Plan </h2>
        <p class="text-gray-500 text-sm mb-8">Streamline your document workflow and boost your productivity today.</p>

        <div v-if="loading" class="py-20 text-center">
          <div class="animate-spin inline-block w-8 h-8 border-4 border-gray-800 border-t-transparent rounded-full mb-2"></div>
          <p class="text-gray-500 font-medium">Memuat paket...</p>
        </div>

        <div v-else class="flex flex-col md:flex-row gap-4 justify-center">
          <div 
            v-for="plan in plans" 
            :key="plan.id"
            @click="selectPlan(plan)"
            :class="[
              'flex-1 flex flex-col justify-between p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer group',
              selectedPlan?.id === plan.id 
                ? 'border-gray-800 bg-gray-800 text-white' 
                : 'border-gray-200 bg-gray-50 hover:border-gray-400 text-gray-800'
            ]"
          >
            <div class="text-left">
              <div class="flex justify-between items-start mb-4">
                <span :class="[
                  'px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest',
                  selectedPlan?.id === plan.id ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'
                ]">
                  {{ plan.duration_days }} Day
                </span>
                
                <div v-if="selectedPlan?.id === plan.id" class="text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div class="text-xl font-bold mb-1">{{ plan.name }}</div>
              <div :class="['text-2xl font-black', selectedPlan?.id === plan.id ? 'text-white' : 'text-gray-800']">
                {{ formatPrice(plan.price) }}
              </div>
            </div>
            
            <div :class="['mt-6 pt-4 border-t', selectedPlan?.id === plan.id ? 'border-gray-700' : 'border-gray-200']">
   <ul class="text-[11px] space-y-2">
  <li class="flex items-center">
    <span :class="selectedPlan?.id === plan.id ? 'text-white' : 'text-gray-400'" class="mr-2">✔</span> 
    Active for {{ plan.duration_days }} {{ plan.duration_days > 1 ? 'days' : 'day' }}
  </li>
  <li class="flex items-center">
    <span :class="selectedPlan?.id === plan.id ? 'text-white' : 'text-gray-400'" class="mr-2">✔</span> 
    Full Feature Access
  </li>
  <li class="flex items-center">
    <span :class="selectedPlan?.id === plan.id ? 'text-white' : 'text-gray-400'" class="mr-2">✔</span> 
    Priority Processing
  </li>
</ul>
            </div>
          </div>
        </div>

        <div class="mt-10 flex flex-col items-center">
<button 
  class="w-full md:w-64 bg-gray-800 hover:bg-black text-white font-bold py-4 rounded-xl transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-gray-200"
  :disabled="!selectedPlan || loading"
  @click="confirmSubscription"
>
  {{ loading ? 'PROCESSING...' : 'PROCEED TO PAYMENT' }}
</button>
          <p class="mt-4 text-[9px] text-gray-400 uppercase tracking-[0.2em]">Secure Checkout &bull; No Hidden Fees</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';

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
    const res = await fetch(`http://localhost:8000/api/v1/subscriptions`);
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

const confirmSubscription = () => {
  if (selectedPlan.value) {
    emit('select', selectedPlan.value);
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