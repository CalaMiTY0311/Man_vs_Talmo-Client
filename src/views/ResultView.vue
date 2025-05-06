<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
    <!-- 로딩 인디케이터 -->
    <div v-if="isLoading" class="my-8 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      <p class="mt-4 text-lg">AI 모델이 결과를 분석 중입니다...</p>
    </div>
    
    <div v-else>
      <!-- 오류 페이지 -->
      <div v-if="errorMessage" class="w-full max-w-md mb-6">
        <!-- 오류 아이콘 -->
        <div class="flex justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <!-- 오류 메시지 -->
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <h2 class="text-xl font-bold mb-2 text-center">서버 연결 오류</h2>
          <p class="mb-2 text-center">서버 연결에 실패했습니다.</p>
        </div>
        
        <!-- 시작 페이지로 바로 가기 버튼 -->
        <div class="flex justify-center">
          <button @click="restartQuiz" class="btn py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            시작 페이지로 돌아가기
          </button>
        </div>
      </div>
      
      <!-- 결과 컨텐츠 (오류가 없을 때만 표시) -->
      <div v-if="!errorMessage">
        <!-- 결과 타이틀 -->
        <h1 class="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-center text-teal-400">당신의 탈모 확률 결과</h1>
        
        <!-- 확률 그래프 -->
        <div class="w-full max-w-md mb-6 sm:mb-8">
          <div class="bg-gray-900 rounded-lg p-4 sm:p-6 relative overflow-hidden">
            <div class="text-5xl sm:text-6xl font-bold text-center mb-2">{{ talmoPercent }}%</div>
            <div class="text-center text-lg mb-4 sm:mb-6">탈모 발생 확률</div>
            
            <!-- 확률 표시 바 -->
            <div class="h-6 sm:h-8 bg-gray-800 rounded-full overflow-hidden mb-3 sm:mb-4">
              <div 
                class="h-full rounded-full" 
                :class="riskColorClass"
                :style="{ width: `${talmoPercent}%` }"
              ></div>
            </div>
            
            <!-- 위험도 상태 -->
            <div class="text-center text-lg font-semibold mb-1" :class="riskColorClass">
              {{ riskLevel }}
            </div>
            <div class="text-center text-sm text-gray-400">위험도 레벨</div>
          </div>
        </div>
        
        <!-- API 결과 정보 -->
        <div v-if="apiResult" class="w-full max-w-md mb-4 bg-gray-900 rounded-lg p-4">
          <div class="flex justify-between mb-2">
            <span class="font-semibold">결과 예측</span>
            <span class="font-bold" :class="apiResult.prediction === 'High' ? 'text-red-500' : 'text-green-500'">
              {{ apiResult.prediction === 'High' ? '위험' : '안전' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold">AI 모델 정확도</span>
            <span class="font-bold">약 80%</span>
          </div>
        </div>
        
        <!-- 결과 설명 -->
        <div class="bg-gray-900 rounded-lg p-4 sm:p-6 w-full max-w-md mb-6 sm:mb-8">
          <p class="text-lg sm:text-xl text-center mb-3 sm:mb-4">
            당신의 데이터 분석 결과:
          </p>
          <div class="text-base sm:text-lg mb-4">
            <p>{{ resultDescription }}</p>
          </div>
          <div class="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-800 rounded-lg">
            <h3 class="font-bold mb-2">결과 해석</h3>
            <p class="text-sm text-gray-300">{{ resultDetail }}</p>
          </div>
        </div>
        
        <!-- 사용자 입력 내용 요약 -->
        <div class="bg-gray-900 rounded-lg p-4 w-full max-w-md mb-6 sm:mb-8">
          <h3 class="font-semibold mb-2">입력하신 데이터</h3>
          <ul class="text-sm divide-y divide-gray-800">
            <li v-for="(answer, index) in quizStore.answers" :key="index" class="py-2 flex justify-between">
              <span>{{ getQuestionLabel(index) }}:</span>
              <span class="font-semibold">{{ formatAnswer(index, answer) }}</span>
            </li>
          </ul>
        </div>
        
        <!-- 결과 공유 & 재시작 버튼 -->
        <div class="flex flex-col w-full max-w-md space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <button @click="shareResult" class="btn py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium">결과 공유하기</button>
          <button @click="restartQuiz" class="btn py-3 px-4 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium">테스트 다시하기</button>
        </div>
      </div>
    </div>
    
    <!-- 주의사항 -->
    <div class="mt-6 sm:mt-8 text-center text-xs text-gray-500 max-w-md px-2">
      <p>
        이 테스트 결과는 인공지능 기반 예측으로 정확한 의학적 진단이 아닙니다.<br>
        탈모에 대한 정확한 진단은 전문의사와 상담하신 후 결정하시기 바랍니다.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuizStore } from '@/stores/quiz'
import { useRouter } from 'vue-router'
import axios from 'axios'

const quizStore = useQuizStore()
const router = useRouter()
const talmoPercent = ref(0)
const apiResult = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
// 오류 메시지만 저장

// 테스트 결과 검증
onMounted(async () => {
  // 모든 질문에 답변했는지 확인
  const allAnswered = quizStore.answers.length === quizStore.quizData.questions.length
  const anyAnswered = quizStore.answers.some(answer => answer !== undefined)
  
  // 결과 페이지에 직접 접근했거나 답변이 없는 경우 인트로 페이지로 리다이렉트
  if (!anyAnswered) {
    router.push('/')
    return
  }
  
  isLoading.value = true
  
  // API 호출하여 결과 가져오기
  try {
    // 모든 필드가 유효한 값을 가지고 있는지 확인
    const validateAnswer = (value, fieldName) => {
      if (value === undefined || value === null || value === '') {
        return false;
      }
      return true;
    };

    // 모든 응답 검증
    const isValid = [
      validateAnswer(quizStore.answers[0], 'age'),
      validateAnswer(quizStore.answers[1], 'gender'),
      validateAnswer(quizStore.answers[2], 'is_married'),
      validateAnswer(quizStore.answers[3], 'is_hereditary'),
      validateAnswer(quizStore.answers[4], 'height'),
      validateAnswer(quizStore.answers[5], 'weight'),
      validateAnswer(quizStore.answers[6], 'is_smoker'),
      validateAnswer(quizStore.answers[7], 'stress')
    ].every(v => v);

    if (!isValid) {
      throw new Error('일부 필수 입력 항목이 누락되었습니다.');
    }

    // 값 확인 - 정확한 인덱스로 가져오기
    let height = quizStore.answers[4]; // 키 (인덱스 4)
    let weight = quizStore.answers[5]; // 몸무게 (인덱스 5)
    let is_smoker = quizStore.answers[6]; // 흡연 여부 (인덱스 6)
    
    console.log('수정된 값 - 키:', height, '몸무게:', weight, '흡연:', is_smoker);

    // 키와 몸무게가 숫자임을 확인
    height = parseFloat(height);
    weight = parseFloat(weight);
    
    const apiData = {
      "age": quizStore.answers[0],
      "gender": quizStore.answers[1],
      "is_married": quizStore.answers[2],
      "is_hereditary": quizStore.answers[3],
      "height": height, // 키
      "weight": weight, // 몸무게
      "is_smoker": is_smoker, // 흡연 여부
      "stress": quizStore.answers[7]
    };
    
    try {
      // API 요청
      console.log('서버로 전송하는 데이터:', apiData);
      const response = await axios.post('http://localhost:1542/predict', apiData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('서버 응답:', response.data);
      
      // 서버 응답 확인
      if (response.data.success === false) {
        // 서버 오류 발생 시
        throw new Error(response.data.data); // 오류 메시지를 통해 catch 블록으로 이동
      }
      
      // 성공적인 결과 처리
      apiResult.value = response.data.data;
      talmoPercent.value = apiResult.value.high_probability || 0;
    } catch (innerError) {
      console.error('서버 요청 오류:', innerError);
      throw innerError; // 외부 catch로 오류 전파
    }
  } catch (error) {
    console.error('API 호출 오류:', error)
    
    // 서버 연결 실패 시 단순 메시지만 설정
    errorMessage.value = '서버 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
})

// 위험도 레벨 계산
const riskLevel = computed(() => {
  const percent = talmoPercent.value
  if (percent < 20) return '매우 낮음'
  if (percent < 40) return '낮음'
  if (percent < 60) return '보통'
  if (percent < 80) return '높음'
  return '매우 높음'
})

// 위험도에 따른 색상 지정
const riskColorClass = computed(() => {
  const percent = talmoPercent.value
  if (percent < 20) return 'bg-green-500 text-green-500'
  if (percent < 40) return 'bg-teal-500 text-teal-500'
  if (percent < 60) return 'bg-yellow-500 text-yellow-500'
  if (percent < 80) return 'bg-orange-500 text-orange-500'
  return 'bg-red-500 text-red-500'
})

// 결과 설명 생성
const resultDescription = computed(() => {
  const percent = talmoPercent.value
  if (percent < 20) {
    return '탈모 발생 확률이 매우 낮습니다. 현재 건강한 두피와 모발 상태를 유지하고 계신 것으로 보입니다.'
  } else if (percent < 40) {
    return '탈모 발생 확률이 낮은 편입니다. 현재 상태를 유지하며 간단한 모발 관리를 하시면 좋을 것 같습니다.'
  } else if (percent < 60) {
    return '탈모 발생 확률이 보통 수준입니다. 스트레스 관리와 두피 관리에 조금 더 신경 쓰시면 좋겠습니다.'
  } else if (percent < 80) {
    return '탈모 발생 확률이 높은 편입니다. 전문적인 두피 관리와 생활습관 개선을 고려해보시길 권장합니다.'
  } else {
    return '탈모 발생 확률이 매우 높습니다. 전문의와 상담하여 적절한 관리 방법을 찾아보시길 권장합니다.'
  }
})

// 결과 상세 설명
const resultDetail = computed(() => {
  const answers = quizStore.answers
  let details = []

  // 나이 관련
  if (answers[0] === '40+' || answers[0] === '50+' || answers[0] === '60+') {
    details.push('연령이 높아질수록 탈모의 발생 가능성이 증가합니다.')
  }

  // 성별 관련
  if (answers[1] === 'male') {
    details.push('남성은 여성보다 유전성 탈모가 발생할 확률이 더 높습니다.')
  }

  // 유전 관련
  if (answers[3] === 'Yes') {
    details.push('가족력이 있는 경우 탈모 발생 확률이 더 높아집니다.')
  }

  // 흡연 관련
  if (answers[6] === 'Yes') {
    details.push('흡연은 모발 성장에 필요한 영양분과 산소의 공급을 저해할 수 있습니다.')
  }

  // 스트레스 관련
  if (answers[7] === 'Level 3' || answers[7] === 'Level 4') {
    details.push('높은 스트레스는 모발 성장 주기에 영향을 미쳐 탈모를 촉진할 수 있습니다.')
  }

  if (details.length === 0) {
    return '현재 입력하신 데이터에서는 특별한 위험 요소가 발견되지 않았습니다.'
  }

  return details.join(' ')
})

// 질문 레이블 가져오기
function getQuestionLabel(index) {
  const questions = quizStore.quizData.questions
  if (!questions[index]) return `질문 ${index + 1}`
  
  return questions[index].text.replace(/\?/g, '').trim()
}

// 답변 포맷팅
function formatAnswer(index, answer) {
  if (answer === undefined) return '-'
  
  const question = quizStore.quizData.questions[index]
  
  // 입력 필드 형식 (배열 인덱스 체크)
  if (index === 4 || index === 5) { // 키(4) 또는 몸무게(5)
    if (question.type === 'height') return `${answer}cm`
    if (question.type === 'weight') return `${answer}kg`
    return `${answer}`
  }
  
  // 선택지 형식
  if (question.options) {
    const option = question.options.find(opt => opt.id === answer)
    return option ? option.text : `${answer}`
  }
  
  return `${answer}`
}

// 결과 공유 기능
function shareResult() {
  // 공유 기능 구현
  if (navigator.share) {
    navigator.share({
      title: '탈모 확률 테스트 결과',
      text: `내 탈모 발생 확률은 ${talmoPercent.value}%입니다. 당신의 탈모 확률도 확인해보세요!`,
      url: window.location.href
    }).catch(err => {
      alert('결과 공유 중 오류가 발생했습니다.')
      console.error('공유 오류:', err)
    })
  } else {
    alert('이 브라우저에서는 공유 기능을 지원하지 않습니다.')
  }
}

// 테스트 다시 시작
function restartQuiz() {
  quizStore.resetQuiz()
  router.push('/')
}
</script>