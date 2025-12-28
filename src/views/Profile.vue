<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- HERO / User Info -->
    <section class="bg-white shadow-md">
      <div class="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 class="text-4xl font-extrabold text-gray-800 mb-2">
          Profile
        </h1>
        <p class="text-gray-600 mb-6">
          Welcome, {{ user.name }}
        </p>
        <p class="text-gray-500">
          Email: {{ user.email }}
        </p>
      </div>
    </section>

    <!-- User Documents -->
    <section class="max-w-5xl mx-auto px-6 py-16">
      <h2 class="text-3xl font-bold text-gray-800 text-center mb-4">
        Your Documents
      </h2>
      <p class="text-center text-gray-600 mb-10">
        List of documents you have uploaded or edited
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="doc in documents"
          :key="doc.id"
          class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
          @click="viewDocument(doc.id)"
        >
          <h3 class="font-semibold text-lg mb-2">{{ doc.name }}</h3>
          <p class="text-sm text-gray-500 mb-2">Type: {{ doc.type }}</p>
          <p class="text-sm text-gray-400">Uploaded: {{ formatDate(doc.created_at) }}</p>
        </div>
      </div>

      <div v-if="documents.length === 0" class="text-center text-gray-500 mt-10">
        You haven't uploaded or edited any documents yet.
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import api from "@/services/api";

const router = useRouter();

const user = ref({});
const documents = ref([]);

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

const viewDocument = (id) => {
  router.push(`/documents/${id}`);
};

const fetchUserData = async () => {
  const token = localStorage.getItem("token");
  if (!token) return router.push("/login");

  try {
    const resUser = await api.get("/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    user.value = resUser.data.user;

    const resDocs = await axios.get("/api/documents", {
      headers: { Authorization: `Bearer ${token}` },
    });
    documents.value = resDocs.data;
  } catch (err) {
    console.error(err);
    window.$alert("Failed to fetch data", "error");
  }
};

onMounted(() => {
  fetchUserData();
});
</script>
