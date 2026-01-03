<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
      <h1 class="text-3xl font-extrabold text-gray-800 text-center mb-2">
        MyDocEase
      </h1>
      <p class="text-center text-gray-500 mb-6">
        Create your account
      </p>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input v-model="form.name" type="text" required placeholder="Your name"
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300 outline-none" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="form.email" type="email" required placeholder="you@example.com"
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300 outline-none" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model="form.password" type="password" required placeholder="••••••••"
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300 outline-none" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input v-model="form.confirmPassword" type="password" required placeholder="••••••••"
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300 outline-none" />
        </div>

        <button type="submit" :disabled="loading"
          class="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Already have an account?
        <span class="text-gray-800 font-semibold cursor-pointer hover:underline" @click="router.push('/login')">
          Login
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '../services/auth.service';
import MESSAGES from '@/utils/message';

const router = useRouter();
const loading = ref(false);

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    window.$alert(MESSAGES.AUTH.FORGOT_PASSWORD_MISMATCH.message, "error");
    return;
  }

  loading.value = true;

  try {
    await AuthService.register({
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.confirmPassword
    });

    router.push({
      path: '/verify-otp',
      query: { email: form.email }
    });
  } catch (err) {
    window.$alert(MESSAGES.SYSTEM.SERVER_ERROR.message, "error");
  } finally {
    loading.value = false;
  }
};
</script>