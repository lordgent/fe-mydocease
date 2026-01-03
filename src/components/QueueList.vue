<template>
  <div class="space-y-3">
    <div v-if="loading" class="space-y-3">
      <div
        v-for="i in 3"
        :key="i"
        class="p-4 bg-white rounded-xl border border-gray-100 flex items-center gap-4 animate-pulse"
      >
        <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-1/3"></div>
          <div class="h-3 bg-gray-100 rounded w-1/4"></div>
        </div>
        <div class="h-8 w-24 bg-gray-200 rounded-lg"></div>
      </div>
    </div>

    <template v-else-if="items.length">
      <div
        v-for="(file, index) in items"
        :key="file.id"
        class="group p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div class="flex items-center gap-4">
          <div class="relative flex-shrink-0">
            <img
              v-if="['convert_pdf', 'signed', 'word_to_pdf','merge_pdf'].includes(file.mode)"
              src="/icons/pdf.png"
              alt="PDF Icon"
              class="w-12 h-12 object-contain bg-gray-50 p-1 rounded-lg"
            />
            <img
              v-else
              :src="file.file_url"
              alt="Preview"
              class="w-12 h-12 object-cover rounded-lg border border-gray-100"
            />
          </div>

          <div class="min-w-0">
            <p class="font-bold text-gray-800 text-base truncate">
              {{ file.filename }}
            </p>
            <p class="text-gray-500 text-xs font-medium">
              #{{ index + 1 }} • <span class="uppercase">{{ file.mode?.replace('_', ' ') }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-none pt-3 sm:pt-0">
          <span
            class="text-[11px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-2"
            :class="{
              'bg-amber-50 text-amber-700 border border-amber-200': file.status === 'pending',
              'bg-blue-50 text-blue-700 border border-blue-200': file.status === 'processing',
              'bg-emerald-50 text-emerald-700 border border-emerald-200': file.status === 'done',
              'bg-red-50 text-red-700 border border-red-200': file.status === 'failed'
            }"
          >
            <svg
              v-if="['pending', 'processing'].includes(file.status)"
              class="w-3 h-3 animate-spin"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            {{ file.status }}
          </span>

          <button
            v-if="file.status === 'failed'"
            @click="$emit('retry', file.id)"
            class="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
          >
            Retry
          </button>

          <button
            v-if="file.status === 'done'"
            @click="$emit('download', file)"
            class="px-4 py-2 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors shadow-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>
      </div>
    </template>

    <div
      v-else
      class="py-12 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl"
    >
      <div class="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p class="text-gray-500 font-medium">No files available</p>
      <p class="text-gray-400 text-sm">Upload a document to get started.</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(["retry", "download"]);
</script>