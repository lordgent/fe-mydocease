<template>
  <Navbar />
  <RouterView />
  <FooterComponent />
</template>

<script setup>
import FooterComponent from './components/FooterComponent.vue'
import Navbar from './components/Navbar.vue'
</script>
