<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
      <h1 class="text-3xl font-extrabold text-gray-800 text-center mb-2">
        MyDocEase
      </h1>
      <p class="text-center text-gray-500 mb-6">
        {{ stepTitle }}
      </p>

      <form v-if="step === 1" @submit.prevent="handleRequestOtp" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            placeholder="you@example.com"
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300 outline-none transition" 
          />
        </div>
        <button 
          type="submit" 
          :disabled="loading" 
          class="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
        >
          {{ loading ? 'Sending...' : 'Send OTP' }}
        </button>
      </form>

      <form v-if="step === 2" @submit.prevent="handleVerifyOtp" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
          <input 
            v-model="form.otp" 
            type="text" 
            maxlength="6" 
            required 
            placeholder="000000"
            class="w-full px-4 py-2 border rounded-lg text-center tracking-[1em] text-xl font-mono focus:ring focus:ring-gray-300 outline-none" 
          />
          <p class="text-xs text-gray-400 mt-2 text-center">Masukkan 6 digit kode yang dikirim ke email</p>
        </div>
        <button 
          type="submit" 
          :disabled="loading" 
          class="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition"
        >
          {{ loading ? 'Verifying...' : 'Verify OTP' }}
        </button>
        <button 
          type="button"
          @click="step = 1" 
          class="w-full text-sm text-gray-500 hover:text-gray-800 transition"
        >
          Ganti Email
        </button>
      </form>

      <form v-if="step === 3" @submit.prevent="handleResetPassword" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input 
            v-model="form.newPassword" 
            type="password" 
            required 
            placeholder="••••••••"
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300 outline-none" 
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input 
            v-model="form.confirmPassword" 
            type="password" 
            required 
            placeholder="••••••••"
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300 outline-none" 
          />
        </div>
        <button 
          type="submit" 
          :disabled="loading" 
          class="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition"
        >
          {{ loading ? 'Resetting...' : 'Update Password' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Remembered your password?
        <router-link to="/login" class="text-gray-800 font-semibold hover:underline">
          Back to Login
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '../services/auth.service';

const router = useRouter();

// State
const step = ref(1);
const loading = ref(false);
const form = reactive({
  email: "",
  otp: "",
  newPassword: "",
  confirmPassword: "",
});

// Kunci buat simpan di browser
const STORAGE_KEY = 'forgot_password_state';

// Cek data lama pas halaman baru dibuka
onMounted(() => {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    const data = JSON.parse(savedState);
    step.value = data.step;
    form.email = data.email;
    // form.otp sengaja nggak usah disimpan demi keamanan
  }
});

// Fungsi buat update state ke local storage
const saveProgress = (currentStep) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    step: currentStep,
    email: form.email
  }));
};

// Fungsi buat hapus jejak (dipakai pas beres reset)
const clearProgress = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// Computed Title
const stepTitle = computed(() => {
  if (step.value === 1) return "Lupa Password?";
  if (step.value === 2) return "Verifikasi Kode OTP";
  return "Buat Password Baru";
});

// Logic - Step 1: Request OTP
const handleRequestOtp = async () => {
  loading.value = true;
  try {
    await AuthService.requestForgotPasswordOtp(form.email);
    window.$alert("OTP berhasil dikirim!", "success");
    step.value = 2;
    saveProgress(2); // Simpan: user udah masuk step 2
  } catch (err) {
    const msg = err.response?.data?.message || "Gagal mengirim email";
    window.$alert(msg, "error");
  } finally {
    loading.value = false;
  }
};

const handleVerifyOtp = async () => {
  loading.value = true;
  try {
    await AuthService.verifyForgotPasswordOtp(form.email, form.otp);
    window.$alert("Kode valid!", "success");
    step.value = 3;
    saveProgress(3); 
  } catch (err) {
    window.$alert("Kode OTP salah atau kedaluwarsa", "error");
  } finally {
    loading.value = false;
  }
};

const handleResetPassword = async () => {
  if (form.newPassword !== form.confirmPassword) {
    return window.$alert("Password tidak cocok", "error");
  }

  loading.value = true;
  try {
    await AuthService.resetPassword(
      form.email, 
      form.otp, 
      form.newPassword, 
      form.confirmPassword
    );
    window.$alert("Password berhasil diperbarui!", "success");
    
    clearProgress(); 
    router.push('/login');
  } catch (err) {
    window.$alert(err.response?.data?.message || "Gagal mereset password", "error");
  } finally {
    loading.value = false;
  }
};

// Tombol Ganti Email
const resetToStepOne = () => {
  clearProgress();
  step.value = 1;
  form.otp = "";
};
</script>

<style scoped>
/* Tambahan agar input OTP terlihat seperti kotak kode */
input[type="text"] {
  text-transform: uppercase;
}
</style>