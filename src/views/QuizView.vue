<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
    
    <!-- 진행 상태 -->
    <div class="w-full max-w-md mb-2">
      <div class="progress-bar">
        <div class="progress" :style="{ width: quizStore.progress + '%' }"></div>
      </div>
      <div class="flex justify-between mt-1">
        <!-- 뒤로가기 버튼 -->
        <button 
          v-if="quizStore.currentQuestionIndex > 0"
          @click="prevQuestion" 
          class="text-sm flex items-center text-teal-400 hover:text-teal-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          뒤로
        </button>
        <div v-else class="text-sm invisible">뒤로</div>
        <div class="text-sm text-gray-400">{{ quizStore.progressText }}</div>
      </div>
    </div>
    
    <transition 
      :name="transitionName" 
      mode="out-in"
    >
      <div 
        :key="quizStore.currentQuestionIndex" 
        class="w-full max-w-md"
      >
        <!-- 질문 -->
        <h2 class="text-3xl font-bold mb-4 text-center text-teal-400">Q{{ quizStore.currentQuestionIndex + 1 }}.</h2>
        
        <!-- 질문 이미지 -->
        <div class="mb-6 flex justify-center">
          <img 
            :src="`/images/questions/q${quizStore.currentQuestionIndex + 1}.jpg`" 
            class="w-32 h-32 object-contain rounded-lg" 
            :alt="`질문 ${quizStore.currentQuestionIndex + 1} 이미지`"
            @error="handleImageError"
          >
        </div>
        
        <p class="text-lg mb-8 text-center">{{ quizStore.currentQuestion.text }}</p>
        
        <!-- 입력 필드 (나이, 몸무게, 키) -->
        <div v-if="quizStore.currentQuestion.inputType === 'number'" class="mb-6">
          <input 
            type="number" 
            v-model="inputValue"
            :min="quizStore.currentQuestion.min"
            :max="quizStore.currentQuestion.max"
            :step="1"
            :placeholder="quizStore.currentQuestion.placeholder"
            class="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-teal-400"
            @keyup.enter="submitInput"
          />
          <button 
            @click="submitInput"
            class="btn mt-4"
            :disabled="!isValidInput"
            :class="{'opacity-50 cursor-not-allowed': !isValidInput}"
          >
            다음
          </button>
        </div>
        
        <!-- 선택지 버튼 -->
        <div v-else class="space-y-3">
          <button 
            v-for="option in quizStore.currentQuestion.options" 
            :key="option.id"
            @click="selectOption(option.id)"
            class="btn"
          >
            {{ option.text }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuizStore } from '@/stores/quiz'
import { useRouter } from 'vue-router'

const quizStore = useQuizStore()
const router = useRouter()
const inputValue = ref('')
const direction = ref(1) // 1: 다음, -1: 이전

// 이미지 오류 처리
function handleImageError(event) {
  // 이미지 로드 실패 시 처리 - 이미지를 표시하지 않음
  event.target.style.display = 'none';
}

// 페이지 전환 방향에 따른 애니메이션 설정
const transitionName = computed(() => {
  return direction.value > 0 ? 'slide-right' : 'slide-left'
})

// 입력값 유효성 검사
const isValidInput = computed(() => {
  if (!quizStore.currentQuestion.inputType) return true
  
  const value = Number(inputValue.value)
  const min = Number(quizStore.currentQuestion.min)
  const max = Number(quizStore.currentQuestion.max)
  
  return !isNaN(value) && value >= min && value <= max && Number.isInteger(value)
})

// 질문이 바뀔 때마다 저장된 답변 불러오기
watch(() => quizStore.currentQuestionIndex, (newIndex) => {
  // 저장된 답변이 있는지 확인
  const savedAnswer = quizStore.answers[newIndex]
  
  if (savedAnswer !== undefined) {
    // 현재 질문 형태에 따라 입력값 설정
    if (quizStore.currentQuestion.inputType === 'number') {
      inputValue.value = savedAnswer
    }
  } else {
    // 저장된 답변이 없으면 초기화
    inputValue.value = ''
  }
})

// 선택지 선택 (바로 다음 질문으로 이동)
function selectOption(optionId) {
  // 답변 저장
  quizStore.selectAnswer(optionId)
  
  // 방향 설정
  direction.value = 1
  
  // 마지막 질문이면 결과 페이지로 이동
  if (quizStore.isLastQuestion) {
    router.push('/result')
  } else {
    // 다음 질문으로 이동
    quizStore.nextQuestion()
  }
}

// 수치 입력값 제출 (나이, 몸무게, 키)
function submitInput() {
  if (!isValidInput.value) return
  
  // 정수로 변환
  const value = parseInt(inputValue.value)
  
  // 입력값이 유효하지 않으면 경고 표시
  if (isNaN(value)) {
    alert('유효한 정수를 입력해주세요.')
    return
  }
  
  quizStore.selectAnswer(value)
  
  // 방향 설정
  direction.value = 1
  
  // 마지막 질문이면 결과 페이지로 이동
  if (quizStore.isLastQuestion) {
    router.push('/result')
  } else {
    // 다음 질문으로 이동
    quizStore.nextQuestion()
  }
}

// 이전 질문으로 이동
function prevQuestion() {
  if (quizStore.currentQuestionIndex > 0) {
    direction.value = -1
    quizStore.prevQuestion()
  }
}

// 초기화: 저장된 답변이 있으면 불러오기
if (quizStore.currentQuestion.inputType === 'number') {
  inputValue.value = quizStore.answers[quizStore.currentQuestionIndex] || ''
}
</script>