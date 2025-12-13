<template>
  <div class="space-y-4">
    <div v-for="(file, index) in items" :key="file.id"
      class="p-4 bg-white rounded-xl shadow-md border flex justify-between items-center">

      <!-- LEFT -->
      <div>

    <img
      v-if="file.mode === 'convert_pdf' || file.mode === 'signed'"
      src="/icons/pdf.png"
      alt="pdf-file"
      class="w-10 h-10 object-contain rounded-md"
    />


        <!-- ELSE: SHOW IMAGE -->
        <img v-else :src="file.file_url" alt="" class="w-10 h-10 object-contain rounded-md" />

        <p class="font-semibold text-gray-800 text-lg">{{ file.filename}}</p>
        <p class="text-gray-400 text-xs">Uploaded file #{{ index + 1 }}</p>
      </div>

      <!-- RIGHT -->
      <div class="flex items-center gap-3">

        <!-- STATUS BADGE -->
        <span class="text-sm px-3 py-1 rounded-full font-medium flex items-center gap-2" :class="{
          'bg-yellow-100 text-yellow-800': file.status === 'pending',
          'bg-blue-100  text-blue-800': file.status === 'processing',
          'bg-green-100 text-green-800': file.status === 'done',
          'bg-red-100   text-red-800': file.status === 'failed'
        }">
          <svg v-if="file.status === 'pending' || file.status === 'processing'" class="w-4 h-4 animate-spin" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>

          {{ file.status }}
        </span>

        <!-- RETRY -->
        <button v-if="file.status === 'failed'" @click="$emit('retry', file.id)"
          class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs">
          retry
        </button>

        <!-- DOWNLOAD -->
        <button v-if="file.status === 'done'" @click="$emit('download', file)"
          class="px-3 py-1 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900">
          Download
        </button>

      </div>
    </div>

    <div v-if="items.length === 0" class="p-4 text-center bg-gray-50 border rounded-xl text-gray-400">
      No files in progress
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
});

defineEmits(["retry", "download"]);
</script>
