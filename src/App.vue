<template>
  <Navbar />
  <RouterView />
  <FooterComponent />
    <Alert ref="globalAlert" />
</template>

<script setup>
import FooterComponent from './components/FooterComponent.vue'
import Navbar from './components/Navbar.vue'
import { ref } from "vue";
import Alert from "./components/Alert.vue";

const globalAlert = ref(null);

window.$alert = (message, type = "success", duration = 3000) => {
  if (globalAlert.value) {
    globalAlert.value.trigger(message, type, duration);
  }
};

</script>

