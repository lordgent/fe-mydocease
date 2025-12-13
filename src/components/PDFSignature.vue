<template>
  <div class="pdf-signature-wrapper">
    <!-- Upload PDF Card -->
    <div class="card">
      <label for="pdfUpload" class="bg-gray-800 text-white p-2 rounded-xl">
        Choose PDF
      </label>
      <input id="pdfUpload" type="file" accept="application/pdf" @change="loadPDF" class="hidden" />
      <p v-if="pdfFileName" class="mt-3 text-gray-700 font-medium">{{ pdfFileName }}</p>
    </div>

    <!-- Upload Signature Card -->
    <transition name="fade">
      <div v-if="totalPages > 0" class="card">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Add Signature</h2>
        
        <label for="signatureUpload" class="bg-gray-800 text-white p-2 rounded-xl">
          Upload Signature
        </label>
        <input id="signatureUpload" ref="imageInput" type="file" accept="image/*" @change="loadImage" class="hidden" />
        
        <div v-if="uploadedImage" class="signature-info">
          <p class="text-sm text-gray-700 mb-3">Signature ready: {{ uploadedImage.name }}</p>
          <button @click="placeImageMode" class="btn-place">
           Place on PDF
          </button>
          <span class="text-sm text-gray-600 ml-3">Click then click on the PDF page</span>
        </div>
      </div>
    </transition>

    <!-- PDF Preview Card -->
    <transition name="fade">
      <div v-if="totalPages > 0" class="card preview-card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">PDF Preview ({{ totalPages }} pages)</h2>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="pdf-pages-container">
          <div v-for="pageNum in totalPages" :key="pageNum" class="page-item">
            <div class="page-label">Page {{ pageNum }}</div>
            <div class="canvas-wrapper" @click="handleCanvasClick($event, pageNum)"
              :style="{ cursor: isPlaceMode ? 'crosshair' : 'default' }">
              <canvas :ref="el => canvasRefs[pageNum - 1] = el" class="pdf-canvas"
                :class="{ 'canvas-active': isPlaceMode }">
              </canvas>

              <!-- Image Overlays -->
              <div v-for="(img, idx) in getImagesForPage(pageNum)" :key="`img-${pageNum}-${idx}`"
                class="image-overlay"
                :style="{
                  left: img.x + 'px',
                  top: img.y + 'px',
                  width: img.width + 'px',
                  height: img.height + 'px',
                }" @mousedown="startDrag($event, pageNum, idx)">
                <img :src="img.src" class="overlay-image" />
                <button @click.stop="removeImage(pageNum, idx)" class="btn-remove">×</button>
                <div @mousedown.stop="startResize($event, pageNum, idx)" class="resize-handle"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Process Button -->
        <button @click="handleExport" :disabled="isExporting || Object.keys(pagedImages).length === 0"
          class="bg-gray-800 text-white py-2 rounded-xl">
          {{ isExporting ? 'Processing...' : 'Signed' }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const emit = defineEmits(['onExport']);

const canvasRefs = ref([]);
const error = ref('');
const totalPages = ref(0);
const uploadedImage = ref(null);
const pagedImages = ref({});
const dragState = ref(null);
const resizeState = ref(null);
const isExporting = ref(false);
const pdfDocument = ref(null);
const isPlaceMode = ref(false);
const imageInput = ref(null);
const pdfFileName = ref('');

async function loadPDF(event) {
  const file = event.target.files[0];
  if (!file) return;

  pdfFileName.value = file.name;
  error.value = '';
  totalPages.value = 0;
  canvasRefs.value = [];
  pagedImages.value = {};
  uploadedImage.value = null;
  isPlaceMode.value = false;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    pdfDocument.value = pdf;
    totalPages.value = pdf.numPages;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });

      await new Promise(resolve => setTimeout(resolve, 0));

      const canvas = canvasRefs.value[pageNum - 1];
      if (!canvas) continue;

      const ctx = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: ctx, viewport }).promise;
    }
  } catch (err) {
    error.value = 'Failed to load PDF: ' + err.message;
    console.error(err);
  }
}

function loadImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImage.value = {
      src: e.target.result,
      name: file.name
    };
    error.value = '';
    isPlaceMode.value = false;
  };
  reader.onerror = () => {
    error.value = 'Failed to load image';
  };
  reader.readAsDataURL(file);
}

function placeImageMode() {
  isPlaceMode.value = true;
  error.value = '';
}

function handleCanvasClick(event, pageNum) {
  if (!isPlaceMode.value) return;
  if (!uploadedImage.value) {
    error.value = 'Upload signature first';
    return;
  }

  const container = event.currentTarget;
  const canvas = canvasRefs.value[pageNum - 1];
  if (!canvas) return;

  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const actualX = x * scaleX;
  const actualY = y * scaleY;

  if (!pagedImages.value[pageNum]) {
    pagedImages.value[pageNum] = [];
  }

  pagedImages.value[pageNum].push({
    src: uploadedImage.value.src,
    x: x - 50,
    y: y - 50,
    width: 100,
    height: 100,
    actualX: actualX - 50 * scaleX,
    actualY: actualY - 50 * scaleY,
    actualWidth: 100 * scaleX,
    actualHeight: 100 * scaleY,
    pageNum: pageNum
  });

  uploadedImage.value = null;
  isPlaceMode.value = false;

  if (imageInput.value) {
    imageInput.value.value = '';
  }
}

function getImagesForPage(pageNum) {
  return pagedImages.value[pageNum] || [];
}

function removeImage(pageNum, idx) {
  pagedImages.value[pageNum].splice(idx, 1);
}

function startDrag(event, pageNum, idx) {
  event.preventDefault();
  event.stopPropagation();

  const img = pagedImages.value[pageNum][idx];
  const canvas = canvasRefs.value[pageNum - 1];

  const container = event.target.closest('.canvas-wrapper');
  const rect = container.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  dragState.value = {
    pageNum,
    idx,
    startX: event.clientX - img.x,
    startY: event.clientY - img.y,
    scaleX,
    scaleY
  };

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
}

function onDrag(event) {
  if (!dragState.value) return;

  const { pageNum, idx, startX, startY, scaleX, scaleY } = dragState.value;
  const img = pagedImages.value[pageNum][idx];

  img.x = event.clientX - startX;
  img.y = event.clientY - startY;
  img.actualX = img.x * scaleX;
  img.actualY = img.y * scaleY;
}

function stopDrag() {
  dragState.value = null;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
}

function startResize(event, pageNum, idx) {
  event.preventDefault();
  event.stopPropagation();

  const img = pagedImages.value[pageNum][idx];
  const canvas = canvasRefs.value[pageNum - 1];

  const container = event.target.closest('.canvas-wrapper');
  const rect = container.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  resizeState.value = {
    pageNum,
    idx,
    startX: event.clientX,
    startY: event.clientY,
    startWidth: img.width,
    startHeight: img.height,
    scaleX,
    scaleY
  };

  document.addEventListener('mousemove', onResize);
  document.addEventListener('mouseup', stopResize);
}

function onResize(event) {
  if (!resizeState.value) return;

  const { pageNum, idx, startX, startY, startWidth, startHeight, scaleX, scaleY } = resizeState.value;
  const img = pagedImages.value[pageNum][idx];

  const deltaX = event.clientX - startX;
  const deltaY = event.clientY - startY;
  const delta = Math.max(deltaX, deltaY);

  img.width = Math.max(50, startWidth + delta);
  img.height = Math.max(50, startHeight + delta);
  img.actualWidth = img.width * scaleX;
  img.actualHeight = img.height * scaleY;
}

function stopResize() {
  resizeState.value = null;
  document.removeEventListener('mousemove', onResize);
  document.removeEventListener('mouseup', stopResize);
}

async function handleExport() {
  if (!canvasRefs.value || canvasRefs.value.length === 0) {
    error.value = 'No PDF loaded';
    return;
  }

  isExporting.value = true;
  error.value = '';

  try {
    const firstCanvas = canvasRefs.value[0];
    if (!firstCanvas) {
      throw new Error('Canvas not found');
    }

    const pdfWidth = firstCanvas.width * 0.264583;
    const pdfHeight = firstCanvas.height * 0.264583;
    const doc = new jsPDF({
      orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [pdfWidth, pdfHeight]
    });

    for (let pageNum = 1; pageNum <= totalPages.value; pageNum++) {
      if (pageNum > 1) {
        doc.addPage([pdfWidth, pdfHeight]);
      }

      const canvas = canvasRefs.value[pageNum - 1];
      if (!canvas) continue;

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');

      tempCtx.fillStyle = 'white';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(canvas, 0, 0);

      const images = pagedImages.value[pageNum] || [];

      for (const img of images) {
        const imgElement = await new Promise((resolve, reject) => {
          const element = new Image();
          element.crossOrigin = 'anonymous';
          element.onload = () => resolve(element);
          element.onerror = reject;
          element.src = img.src;
        });

        tempCtx.drawImage(
          imgElement,
          img.actualX,
          img.actualY,
          img.actualWidth,
          img.actualHeight
        );
      }

      const imgData = tempCanvas.toDataURL('image/jpeg', 0.95);
      doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }

    const pdfBase64 = doc.output('dataurlstring');

    emit('onExport', {
      base64: pdfBase64,
      filename: pdfFileName.value
    });

  } catch (err) {
    error.value = 'Failed to export PDF: ' + err.message;
    console.error('Export error:', err);
  } finally {
    isExporting.value = false;
  }
}
</script>

<style scoped>
.pdf-signature-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  width: 100%;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  cursor: pointer;
  background: #1f2937;
  color: white;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #111827;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  cursor: pointer;
  background: #4f46e5;
  color: white;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #4338ca;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hidden {
  display: none;
}

.signature-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #eff6ff;
  border-radius: 0.75rem;
  width: 100%;
}

.btn-place {
  padding: 0.5rem 1.5rem;
  background: #10b981;
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.btn-place:hover {
  background: #059669;
}

.preview-card {
  align-items: stretch;
}

.error-message {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #fee;
  color: #dc2626;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.pdf-pages-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.page-item {
  position: relative;
}

.page-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.canvas-wrapper {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.pdf-canvas {
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  max-width: 100%;
  display: block;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.canvas-active {
  border-color: #10b981;
}

.image-overlay {
  position: absolute;
  cursor: move;
  border: 2px solid #10b981;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.overlay-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

.btn-remove {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  transition: background 0.2s;
}

.btn-remove:hover {
  background: #dc2626;
}

.resize-handle {
  position: absolute;
  bottom: -6px;
  right: -6px;
  width: 12px;
  height: 12px;
  background: #3b82f6;
  border: 2px solid white;
  border-radius: 50%;
  cursor: nwse-resize;
}

.btn-export {
  width: 100%;
  padding: 0.75rem 2rem;
  background: #4f46e5;
  color: white;
  font-weight: 600;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.btn-export:hover:not(:disabled) {
  background: #4338ca;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-export:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>