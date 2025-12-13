<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">

    <!-- HERO / CONTACT HEADER -->
    <section class="bg-gray-800 text-white">
      <div class="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 class="text-5xl sm:text-6xl font-extrabold mb-4">Get in Touch</h1>
        <p class="text-lg sm:text-xl mb-2">
          We'd love to hear your feedback, questions, or suggestions.
        </p>
        <p class="text-sm sm:text-base opacity-90">
          Fill out the form below and our team will respond promptly.
        </p>
      </div>
    </section>

    <!-- CONTACT FORM SECTION -->
    <section class="max-w-5xl w-full mx-auto px-6 py-20">
      <form @submit.prevent="submitForm" class="bg-white p-12 rounded-3xl shadow-2xl space-y-8">

        <div>
          <label class="block text-gray-700 font-medium mb-2" for="email">Email Address</label>
          <input v-model="email" type="email" id="email" placeholder="you@example.com" required
            class="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-800 transition" />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2" for="message">Your Message</label>
          <textarea v-model="message" id="message" placeholder="Write your message or suggestion here..." rows="7"
            required
            class="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-800 transition"></textarea>
        </div>

        <button type="submit"
          class="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-4 rounded-2xl shadow-md transition transform hover:-translate-y-0.5">
          Send Message
        </button>

        <p v-if="successMessage" class="text-green-600 font-medium text-center mt-4">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-600 font-medium text-center mt-4">{{ errorMessage }}</p>
      </form>
    </section>

  </div>
</template>

<script>
export default {
  name: "Contact",
  data() {
    return {
      email: "",
      message: "",
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    submitForm() {
      if (this.email && this.message) {
        this.errorMessage = "";
        this.successMessage = "Thank you! Your message has been sent successfully.";
        this.email = "";
        this.message = "";
      } else {
        this.errorMessage = "Please complete all fields before submitting.";
        this.successMessage = "";
      }
    },
  },
};
</script>
