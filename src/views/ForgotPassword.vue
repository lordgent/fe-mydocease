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
          <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input v-model="form.email" type="email" required placeholder="name@email.com"
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300 outline-none transition" />
        </div>
        <button type="submit" :disabled="loading"
          class="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50">
          {{ loading ? 'Sending code...' : 'Send Reset Link' }}
        </button>
      </form>

      <form v-if="step === 2" @submit.prevent="handleVerifyOtp" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
          <input v-model="form.otp" type="text" maxlength="6" required placeholder="Enter 6-digit code"
            class="w-full px-4 py-2 border rounded-lg text-center tracking-[0.5em] text-xl font-mono focus:ring focus:ring-gray-300 outline-none" />
          <p class="text-xs text-gray-400 mt-2 text-center">
            Please enter the 6-digit code sent to your email.
          </p>
        </div>
        <button type="submit" :disabled="loading"
          class="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition">
          {{ loading ? 'Checking...' : 'Verify & Continue' }}
        </button>
        <button type="button" @click="step = 1" class="w-full text-sm text-gray-500 hover:text-gray-800 transition">
          Use a different email
        </button>
      </form>

      <form v-if="step === 3" @submit.prevent="handleResetPassword" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input v-model="form.newPassword" type="password" required placeholder="At least 8 characters"
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input v-model="form.confirmPassword" type="password" required placeholder="Repeat your password"
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300 outline-none" />
        </div>
        <button type="submit" :disabled="loading"
          class="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition">
          {{ loading ? 'Updating...' : 'Save New Password' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Suddenly remembered?
        <router-link to="/login" class="text-gray-800 font-semibold hover:underline">
          Go back to Login
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '../services/auth.service';
import MESSAGES from '@/utils/message';

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

const STORAGE_KEY = 'forgot_password_state';

onMounted(() => {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    const data = JSON.parse(savedState);
    step.value = data.step;
    form.email = data.email;
  }
});

const saveProgress = (currentStep) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    step: currentStep,
    email: form.email
  }));
};

const clearProgress = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const stepTitle = computed(() => {
  if (step.value === 1) return "Reset your password";
  if (step.value === 2) return "Check your email";
  return "Set a new password";
});

const handleRequestOtp = async () => {
  loading.value = true;
  try {
    await AuthService.requestForgotPasswordOtp(form.email);
    step.value = 2;
    saveProgress(2); 
  } catch (err) {
    window.$alert(MESSAGES.SYSTEM.SERVER_ERROR.message, "error");
  } finally {
    loading.value = false;
  }
};

const handleVerifyOtp = async () => {
  loading.value = true;
  try {
    await AuthService.verifyForgotPasswordOtp(form.email, form.otp);
    step.value = 3;
    saveProgress(3);
  } catch (err) {
    window.$alert(MESSAGES.AUTH.FORGOT_TOKEN_EXPIRED.message, "error");
  } finally {
    loading.value = false;
  }
};

const handleResetPassword = async () => {
  if (form.newPassword !== form.confirmPassword) {
    window.$alert(MESSAGES.AUTH.FORGOT_PASSWORD_MISMATCH.message, "error");
  }

  loading.value = true;
  try {
    await AuthService.resetPassword(
      form.email,
      form.otp,
      form.newPassword,
      form.confirmPassword
    );
    window.$alert(MESSAGES.AUTH.FORGOT_SUCCESS.message, "success");

    clearProgress();
    router.push('/login');
  } catch (err) {
    window.$alert(MESSAGES.SYSTEM.SERVER_ERROR.message, "error");
  } finally {
    loading.value = false;
  }
};

const resetToStepOne = () => {
  clearProgress();
  step.value = 1;
  form.otp = "";
};
</script>

<style scoped>
input[type="text"] {
  text-transform: uppercase;
}
</style>