<template>
  <div class="pdf-signature-wrapper">
    <div class="card">
      <label for="pdfUpload" class="bg-gray-800 text-white p-2 rounded-xl cursor-pointer">
        Choose PDF
      </label>
      <input id="pdfUpload" type="file" accept="application/pdf" @change="loadPDF" class="hidden" />
      <p v-if="pdfFileName" class="mt-3 text-gray-700 font-medium">{{ pdfFileName }}</p>
    </div>

    <transition name="fade">
      <div v-if="totalPages > 0" class="card">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Add Signature</h2>
        
        <label for="signatureUpload" class="bg-gray-800 text-white p-2 rounded-xl cursor-pointer">
          Upload Signature
        </label>
        <input id="signatureUpload" ref="imageInput" type="file" accept="image/*" @change="loadImage" class="hidden" />
        
        <div v-if="uploadedImage" class="signature-info">
          <p class="text-sm text-gray-700 mb-3">Signature ready: {{ uploadedImage.name }}</p>
          <button @click="placeImageMode" class="btn-place">
           Place on PDF
          </button>
          <span class="text-sm text-gray-600 ml-3">Click/Tap on the PDF page</span>
        </div>
      </div>
    </transition>

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

              <div v-for="(img, idx) in getImagesForPage(pageNum)" :key="`img-${pageNum}-${idx}`"
                class="image-overlay"
                :style="{
                  left: img.x + 'px',
                  top: img.y + 'px',
                  width: img.width + 'px',
                  height: img.height + 'px',
                }" 
                @mousedown="startDrag($event, pageNum, idx)"
                @touchstart.passive="startDrag($event, pageNum, idx)">
                
                <img :src="img.src" class="overlay-image" />
                <button @click.stop="removeImage(pageNum, idx)" class="btn-remove">×</button>
                
                <div 
                  @mousedown.stop="startResize($event, pageNum, idx)" 
                  @touchstart.stop.passive="startResize($event, pageNum, idx)"
                  class="resize-handle">
                </div>
              </div>
            </div>
          </div>
        </div>

        <button @click="handleExport" :disabled="isExporting || Object.keys(pagedImages).length === 0"
          class="bg-gray-800 text-white py-2 rounded-xl">
          {{ isExporting ? 'Processing...' : 'Export Signed PDF' }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

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

// --- Helper: Mendapatkan Koordinat Mouse/Touch ---
function getCoords(event) {
  if (event.touches && event.touches.length > 0) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }
  return { x: event.clientX, y: event.clientY };
}

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

    setTimeout(async () => {
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRefs.value[pageNum - 1];
        if (!canvas) continue;

        const ctx = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: ctx, viewport }).promise;
      }
    }, 100);
  } catch (err) {
    error.value = 'Failed to load PDF: ' + err.message;
  }
}

function loadImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImage.value = { src: e.target.result, name: file.name };
    isPlaceMode.value = false;
  };
  reader.readAsDataURL(file);
}

function placeImageMode() {
  isPlaceMode.value = true;
}

function handleCanvasClick(event, pageNum) {
  if (!isPlaceMode.value || !uploadedImage.value) return;

  const container = event.currentTarget;
  const canvas = canvasRefs.value[pageNum - 1];
  const rect = container.getBoundingClientRect();
  
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  if (!pagedImages.value[pageNum]) pagedImages.value[pageNum] = [];

  pagedImages.value[pageNum].push({
    src: uploadedImage.value.src,
    x: x - 50,
    y: y - 50,
    width: 100,
    height: 100,
    actualX: (x - 50) * scaleX,
    actualY: (y - 50) * scaleY,
    actualWidth: 100 * scaleX,
    actualHeight: 100 * scaleY,
  });

  uploadedImage.value = null;
  isPlaceMode.value = false;
}

// --- Drag Logic ---
function startDrag(event, pageNum, idx) {
  if (event.type === 'mousedown') event.preventDefault();
  event.stopPropagation();

  const pos = getCoords(event);
  const img = pagedImages.value[pageNum][idx];
  const container = event.target.closest('.canvas-wrapper');
  const rect = container.getBoundingClientRect();
  const canvas = canvasRefs.value[pageNum - 1];

  dragState.value = {
    pageNum, idx,
    startX: pos.x - img.x,
    startY: pos.y - img.y,
    scaleX: canvas.width / rect.width,
    scaleY: canvas.height / rect.height
  };

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('touchmove', onDrag, { passive: false });
  window.addEventListener('touchend', stopDrag);
}

function onDrag(event) {
  if (!dragState.value) return;
  if (event.cancelable) event.preventDefault();

  const pos = getCoords(event);
  const { pageNum, idx, startX, startY, scaleX, scaleY } = dragState.value;
  const img = pagedImages.value[pageNum][idx];

  img.x = pos.x - startX;
  img.y = pos.y - startY;
  img.actualX = img.x * scaleX;
  img.actualY = img.y * scaleY;
}

function stopDrag() {
  dragState.value = null;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('touchmove', onDrag);
  window.removeEventListener('touchend', stopDrag);
}

// --- Resize Logic ---
function startResize(event, pageNum, idx) {
  if (event.type === 'mousedown') event.preventDefault();
  event.stopPropagation();

  const pos = getCoords(event);
  const img = pagedImages.value[pageNum][idx];
  const container = event.target.closest('.canvas-wrapper');
  const rect = container.getBoundingClientRect();
  const canvas = canvasRefs.value[pageNum - 1];

  resizeState.value = {
    pageNum, idx,
    startX: pos.x,
    startY: pos.y,
    startWidth: img.width,
    startHeight: img.height,
    scaleX: canvas.width / rect.width,
    scaleY: canvas.height / rect.height
  };

  window.addEventListener('mousemove', onResize);
  window.addEventListener('mouseup', stopResize);
  window.addEventListener('touchmove', onResize, { passive: false });
  window.addEventListener('touchend', stopResize);
}

function onResize(event) {
  if (!resizeState.value) return;
  if (event.cancelable) event.preventDefault();

  const pos = getCoords(event);
  const { pageNum, idx, startX, startY, startWidth, startHeight, scaleX, scaleY } = resizeState.value;
  const img = pagedImages.value[pageNum][idx];

  const deltaX = pos.x - startX;
  const deltaY = pos.y - startY;
  const delta = Math.max(deltaX, deltaY); // Proportional resize

  img.width = Math.max(30, startWidth + delta);
  img.height = Math.max(30, startHeight + delta);
  img.actualWidth = img.width * scaleX;
  img.actualHeight = img.height * scaleY;
}

function stopResize() {
  resizeState.value = null;
  window.removeEventListener('mousemove', onResize);
  window.removeEventListener('mouseup', stopResize);
  window.removeEventListener('touchmove', onResize);
  window.removeEventListener('touchend', stopResize);
}

function getImagesForPage(pageNum) {
  return pagedImages.value[pageNum] || [];
}

function removeImage(pageNum, idx) {
  pagedImages.value[pageNum].splice(idx, 1);
}

async function handleExport() {
  isExporting.value = true;
  try {
    const firstCanvas = canvasRefs.value[0];
    const pdfWidth = firstCanvas.width * 0.264583;
    const pdfHeight = firstCanvas.height * 0.264583;
    const doc = new jsPDF({
      orientation: pdfWidth > pdfHeight ? 'l' : 'p',
      unit: 'mm',
      format: [pdfWidth, pdfHeight]
    });

    for (let i = 1; i <= totalPages.value; i++) {
      if (i > 1) doc.addPage([pdfWidth, pdfHeight]);
      const canvas = canvasRefs.value[i - 1];
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const ctx = tempCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, 0);

      const images = pagedImages.value[i] || [];
      for (const img of images) {
        const el = await new Promise(r => {
          const m = new Image();
          m.onload = () => r(m);
          m.src = img.src;
        });
        ctx.drawImage(el, img.actualX, img.actualY, img.actualWidth, img.actualHeight);
      }
      doc.addImage(tempCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }
    emit('onExport', { base64: doc.output('dataurlstring'), filename: pdfFileName.value });
  } catch (err) {
    error.value = 'Export failed';
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
  padding: 10px;
}

.card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.canvas-wrapper {
  position: relative;
  display: inline-block;
  max-width: 100%;
  touch-action: manipulation; /* Membantu scroll tapi tetap bisa interaksi */
}

.pdf-canvas {
  border: 1px solid #ddd;
  max-width: 100%;
  height: auto !important;
}

.image-overlay {
  position: absolute;
  border: 2px solid #10b981;
  touch-action: none; /* WAJIB: mematikan scroll saat drag */
  user-select: none;
}

.overlay-image {
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  bottom: -12px;
  right: -12px;
  width: 24px; /* Lebih besar untuk jari */
  height: 24px;
  background: #3b82f6;
  border: 3px solid white;
  border-radius: 50%;
  cursor: nwse-resize;
  touch-action: none;
  z-index: 10;
}

.btn-remove {
  position: absolute;
  top: -12px;
  left: -12px;
  width: 24px;
  height: 24px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  border: none;
  font-weight: bold;
}

.signature-info {
  margin-top: 1rem;
  text-align: center;
}

.btn-place {
  background: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
}

.hidden { display: none; }
</style>