<template>
  <transition name="fade">
    <div
      v-if="show"
      :class="`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${bgColor} text-white px-4 py-2 rounded-md shadow-md text-sm text-center`"
      style="min-width: 250px; max-width: 90%;"
    >
      {{ currentMessage }}
    </div>
  </transition>
</template>

<script>
export default {
  name: "Alert",
  data() {
    return {
      show: false,
      currentMessage: "",
      currentType: "success",
      currentDuration: 3000,
    };
  },
  computed: {
    bgColor() {
      switch (this.currentType) {
        case "success":
          return "bg-green-500";
        case "error":
          return "bg-red-500";
        case "info":
          return "bg-blue-500";
        default:
          return "bg-gray-500";
      }
    },
  },
  methods: {
    trigger(message, type = "success", duration = 3000) {
      this.currentMessage = message;
      this.currentType = type;
      this.currentDuration = duration;
      this.show = true;

      setTimeout(() => {
        this.show = false;
      }, this.currentDuration);
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
