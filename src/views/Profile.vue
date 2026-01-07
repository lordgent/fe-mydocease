<template>
  <div class="min-h-screen bg-white flex flex-col font-sans antialiased text-gray-800">

    <main class="flex-grow max-w-5xl mx-auto w-full px-6 py-12">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div class="space-y-2">
          <h1 class="text-6xl font-black text-gray-900 tracking-tighter">Profile.</h1>
          <p class="text-gray-400 font-medium tracking-tight">Info your account and subscription details.</p>
        </div>
        
        <div class="flex flex-col items-start md:items-end gap-4">
          <div v-if="user.subscription_until" class="md:text-right space-y-1">
            <div class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Subscription Status</div>
            <div class="flex items-center gap-2 md:justify-end">
              <span class="text-[10px] font-black px-2 py-1 border border-gray-800 rounded-md">
                UNTIL {{ formatDate(user.subscription_until) }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 min-w-[240px]">
            <div class="w-12 h-12 bg-gray-800 text-white rounded-xl flex items-center justify-center text-xl font-bold">
              {{ user.name?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div class="overflow-hidden">
              <div class="text-sm font-black truncate">{{ user.name }}</div>
              <div class="text-[11px] text-gray-400 truncate">{{ user.email }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-8">
        <div class="flex items-center justify-between border-b-2 border-gray-800 pb-4">
          <h2 class="text-sm font-black uppercase tracking-[0.3em]">Billing History</h2>
          <button 
            @click="getListTransaction" 
            class="text-[10px] font-black uppercase tracking-widest hover:text-gray-400 transition-all flex items-center gap-2"
            :disabled="loadingFetch"
          >
            <span :class="{ 'animate-spin': loadingFetch }">⟳</span>
            {{ loadingFetch ? 'Updating' : 'Refresh List' }}
          </button>
        </div>

        <div class="overflow-x-auto overflow-y-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                <th class="py-4 pr-4">Reference</th>
                <th class="py-4 px-4">Package</th>
                <th class="py-4 px-4">Amount</th>
                <th class="py-4 px-4">Purchase Date</th>
                <th class="py-4 pl-4 text-right">Status</th>
              </tr>
            </thead>
            
            <tbody v-if="!loadingFetch && transactions.length > 0" class="divide-y divide-gray-50">
              <tr v-for="item in transactions" :key="item.id" class="group hover:bg-gray-50/50 transition-colors">
                <td class="py-6 pr-4">
                  <div class="text-xs font-mono font-bold text-gray-400 group-hover:text-gray-800">
                    #{{ item.reference_id?.split('-')[1] || item.id }}
                  </div>
                </td>
                <td class="py-6 px-4">
                  <span class="text-xs font-black uppercase tracking-tight">{{ item.subscription_package?.name || 'Pro Plan' }}</span>
                </td>
                <td class="py-6 px-4 text-sm font-medium">
                  Rp {{ Number(item.amount || 0).toLocaleString('id-ID') }}
                </td>
                <td class="py-6 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                  {{ formatDate(item.created_at) }}
                </td>
                <td class="py-6 pl-4 text-right">
                  <span 
                    :class="statusStyles(item.status)"
                    class="inline-block px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border"
                  >
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="loadingFetch" class="py-24 text-center">
            <div class="text-xs font-black uppercase tracking-[0.4em] text-gray-200 animate-pulse">Synchronizing Data...</div>
          </div>
          
          <div v-else-if="transactions.length === 0" class="py-24 text-center">
            <div class="text-xs font-black uppercase tracking-[0.2em] text-gray-300">Empty Ledger</div>
            <p class="text-[10px] text-gray-200 uppercase mt-2">No transaction activity recorded</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import { SubscriptionService } from '../services/subscription.service';

const router = useRouter();
const user = ref({});
const transactions = ref([]);
const loadingFetch = ref(false);

const fetchUserData = async () => {
  const token = localStorage.getItem("token");
  if (!token) return router.push("/login");
  try {
    const resUser = await api.get("/me");
    // Sesuaikan dengan struktur response Anda (data.user)
    user.value = resUser.data.user || resUser.data;
  } catch (err) {
    console.error("User fetch error:", err);
    if (err.response?.status === 401) router.push("/login");
  }
};

const getListTransaction = async () => {
  loadingFetch.value = true;
  try {
    const res = await SubscriptionService.getListTransaction();
    if (res && res.success) {
      transactions.value = res.data;
    }
  } catch (err) {
    console.error("Failed to fetch transaction", err);
  } finally {
    loadingFetch.value = false;
  }
};


const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options).toUpperCase();
};

const isExpired = (dateString) => {
  if (!dateString) return true;
  return new Date(dateString) < new Date();
};

const statusStyles = (status) => {
  const s = status?.toLowerCase();
  // Status Sukses: Hitam Pekat
  if (s === 'success' || s === 'settlement' || s === 'capture') {
    return 'bg-gray-800 text-white border-gray-800';
  } 
  // Status Pending: Border Abu-abu
  else if (s === 'pending') {
    return 'bg-white text-gray-400 border-gray-200';
  } 
  else {
    return 'bg-gray-50 text-gray-300 border-transparent';
  }
};

onMounted(() => {
  fetchUserData();
  getListTransaction();
});
</script>

<style scoped>
.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
</style>