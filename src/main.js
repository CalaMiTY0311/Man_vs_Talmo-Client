import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/main.css'
import './assets/responsive.css'

// 라우트 정의
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/IntroView.vue')
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: () => import('./views/QuizView.vue')
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('./views/ResultView.vue')
  }
]

// 라우터 생성
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Pinia 스토어 생성
const pinia = createPinia()

// 앱 생성 및 마운트
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')