import About from '@/views/About.vue'
import CompressPage from '@/views/CompressPage.vue'
import ContactUs from '@/views/ContactUs.vue'
import CropPage from '@/views/CropPage.vue'
import Home from '@/views/Home.vue'
import ConvertImageToPDF from '@/views/ConvertImageToPDF.vue'
import { createRouter, createWebHistory } from 'vue-router'
import SignedPDF from '@/views/SignedPDF.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  { path: '/', component: Home },
  { path: '/editor/crop', component: CropPage },
  { path: '/editor/compress', component: CompressPage },
  { path: '/editor/convert-image-pdf', component: ConvertImageToPDF },
  { path: '/editor/signed-pdf', component: SignedPDF },
  { path: '/about', component: About },
  { path: '/contact', component: ContactUs },
]
})

export default router
