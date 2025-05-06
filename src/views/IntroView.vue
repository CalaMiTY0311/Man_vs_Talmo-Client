<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <!-- 타이틀 -->
    <h1 class="text-5xl font-bold mb-2 text-center text-teal-400">Man vs Talmo</h1>
    <p class="text-xl mb-4 text-center">{{ quizStore.quizData.subtitle }}</p>
    <p class="text-sm mb-8 text-center text-gray-400">{{ quizStore.quizData.description }}</p>
    
    <!-- 이미지 슬라이더 -->
    <div class="w-full max-w-md mb-8 relative overflow-hidden rounded-lg shadow-lg">
      <!-- 그라디언트 제거 -->
      
      <!-- 슬라이더 컨테이너 -->
      <div class="slider-container" ref="sliderContainer" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="(image, index) in sliderImages" :key="index" class="slider-item">
          <img :src="image.src" class="w-full h-64 object-contain" :alt="image.alt" @error="handleImageError(index)">
        </div>
      </div>
    </div>
    
    <!-- 시작 버튼 -->
    <button @click="startQuiz" class="btn max-w-md text-lg font-bold py-4">
      탈모 확률 검사 시작
    </button>
    
    <!-- 간단한 설명 -->
    <div class="mt-8 text-center text-sm text-gray-500 max-w-md">
      <p>이 테스트는 8개의 질문을 통해 탈모 발생 확률을 예측합니다.<br>기계학습 모델을 통한 분석 결과로, 정확한 의학적 진단이 아닙니다.</p>
    </div>
  </div>
</template>

<script setup>
import { useQuizStore } from '@/stores/quiz'
import { useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const quizStore = useQuizStore()
const router = useRouter()

// 슬라이더 상태 관리
const currentSlide = ref(0)
const sliderInterval = ref(null)
const sliderContainer = ref(null)

// 이미지 배열 (여기에 이미지 경로를 넣으세요)
const sliderImages = ref([
  { src: '/images/slider/slide1.jpg', alt: '탈모 테스트 이미지 1' },
  { src: '/images/slider/slide2.jpg', alt: '탈모 테스트 이미지 2' },
  { src: '/images/slider/slide3.jpg', alt: '탈모 테스트 이미지 3' },
  { src: '/images/slider/slide4.jpg', alt: '탈모 테스트 이미지 4' }
])

// 기본 이미지 설정 (이미지가 없을 경우 대체 이미지)
const fallbackImage = ref('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMzMzMiIHJ4PSIxMCIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM1Y2Q1YzQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1hbiB2cyBUYWxtbzwvdGV4dD4KPC9zdmc+') 

// 특정 슬라이드로 이동
function goToSlide(index) {
  currentSlide.value = index
  resetInterval() // 슬라이드 변경 시 타이머 초기화
}

// 다음 슬라이드로 이동
function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % sliderImages.value.length
}

// 타이머 초기화
function resetInterval() {
  clearInterval(sliderInterval.value)
  sliderInterval.value = setInterval(() => {
    nextSlide()
  }, 3000) // 3초마다 슬라이드 변경
}

// 이미지 로드 오류 처리
function handleImageError(index) {
  sliderImages.value[index].src = fallbackImage.value
}

// 컴포넌트 마운트 시 타이머 시작
onMounted(() => {
  resetInterval()
})

// 컴포넌트 언마운트 시 타이머 정리
onBeforeUnmount(() => {
  clearInterval(sliderInterval.value)
})

// 퀴즈 초기화 및 시작
function startQuiz() {
  quizStore.resetQuiz()
  router.push('/quiz')
}
</script>

<style scoped>
.slider-container {
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
}

.slider-item {
  min-width: 100%;
  flex-shrink: 0;
}
</style>