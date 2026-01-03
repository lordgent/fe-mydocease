import About from '@/views/About.vue'
import CompressPage from '@/views/CompressPage.vue'
import ContactUs from '@/views/ContactUs.vue'
import CropPage from '@/views/CropPage.vue'
import Home from '@/views/Home.vue'
import ConvertImageToPDF from '@/views/ConvertImageToPDF.vue'
import { createRouter, createWebHistory } from 'vue-router'
import SignedPDF from '@/views/SignedPDF.vue'
import WordToPdf from '@/views/WordToPdf.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Profile from '@/views/Profile.vue'
import VerifyOtp from '@/views/VerifyOtp.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import MergePdf from '@/views/MergePdf.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  { path: '/', component: Home },
  { path: '/editor/crop', component: CropPage,   meta: { requiresAuth: true }, },
  { path: '/editor/compress', component: CompressPage,  meta: { requiresAuth: true },  },
  { path: '/editor/convert-image-pdf', component: ConvertImageToPDF,  meta: { requiresAuth: true },  },
  { path: '/editor/signed-pdf', component: SignedPDF,  meta: { requiresAuth: true },  },
  { path: '/editor/word-to-pdf', component: WordToPdf,  meta: { requiresAuth: true },  },
  { path: '/editor/merge-pdf', component: MergePdf,  meta: { requiresAuth: true },  },
  { path: '/profile', component: Profile,  meta: { requiresAuth: true },  },
  { path: '/about', component: About },
  { path: '/contact', component: ContactUs },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/verify-otp', component: VerifyOtp },
  { path: '/forgot-password', component: ForgotPassword },
],
 scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

export default router
