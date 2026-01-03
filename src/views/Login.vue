<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
      <!-- Title -->
      <h1 class="text-3xl font-extrabold text-gray-800 text-center mb-2">
        MyDocEase
      </h1>
      <p class="text-center text-gray-500 mb-6">
        Login to your account
      </p>

<form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input v-model="form.email" type="email" required placeholder="you@example.com"
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300 outline-none" />
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-sm font-medium text-gray-700">
              Password
            </label>
          
          </div>
          <input v-model="form.password" type="password" required placeholder="••••••••"
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300 outline-none" />
              <router-link to="/forgot-password" class="text-xs text-right text-gray-500 hover:text-gray-800 hover:underline">
              Forgot password?
            </router-link>
        </div>

        <button type="submit" :disabled="loading" class="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <!-- Extra -->
      <p class="text-center text-sm text-gray-500 mt-6">
        Don't have an account?
        <span class="text-gray-800 font-semibold cursor-pointer hover:underline" @click="$router.push('/register')">
          Register
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import { AuthService } from '../services/auth.service'
import MESSAGES from '@/utils/message';

export default {
  name: "Login",
  data() {
    return {
      loading: false,
      error: "",
      form: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = "";

      try {
        await AuthService.login(this.form);
        window.$alert(MESSAGES.AUTH.SUCCESS.message, "success");
        window.location.href = "/";
      } catch (err) {
        const message =
          MESSAGES.AUTH.INVALID.message;
        this.error = message;
        window.$alert(message, "error");
      } finally {
        this.loading = false;
      }
    },

  },
};
</script>
