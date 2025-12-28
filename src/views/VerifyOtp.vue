<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
      <h1 class="text-3xl font-extrabold text-gray-800 text-center mb-2">
        MyDocEase
      </h1>
      <p class="text-center text-gray-500 mb-6">
        Enter the 6-digit code sent to your email
      </p>

      <form @submit.prevent="handleVerify" class="space-y-6">
        <div class="flex justify-between gap-2">
          <input
            v-for="(digit, index) in 6"
            :key="index"
            :id="'otp-' + index"
            v-model="otp[index]"
            type="text"
            maxlength="1"
            class="w-12 h-12 text-center text-xl font-bold border rounded-lg focus:ring focus:ring-gray-300 outline-none transition"
            @input="focusNext($event, index)"
            @keydown.delete="focusPrev($event, index)"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition disabled:bg-gray-400"
        >
          {{ loading ? 'Verifying...' : 'Verify Account' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Didn't receive the code?
        <span
          class="text-gray-800 font-semibold cursor-pointer hover:underline"
          @click="resendOtp"
        >
          Resend
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  name: "VerifyOtp",
  data() {
    return {
      loading: false,
      otp: ["", "", "", "", "", ""],
      email: this.$route.query.email || "", 
    };
  },
  methods: {
    focusNext(e, index) {
      const val = e.target.value;
      if (val && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    },
    focusPrev(e, index) {
      if (!this.otp[index] && index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    },
    async handleVerify() {
      const fullOtp = this.otp.join("");
      if (fullOtp.length < 6) {
        alert("Please enter all 6 digits");
        return;
      }

      this.loading = true;
      try {
        await api.post("/verify", {
          email: this.email,
          otp_code: fullOtp,
        });

        alert("Email verified successfully!");
        this.$router.push("/login");
      } catch (err) {
        alert(err.response?.data?.message || "Verification failed");
      } finally {
        this.loading = false;
      }
    },
    async resendOtp() {
      try {
        await api.post("/resend-otp", { email: this.email });
        alert("New OTP code has been sent!");
      } catch (err) {
        alert("Failed to resend OTP");
      }
    }
  },
};
</script>