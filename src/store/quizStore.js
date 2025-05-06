import { create } from 'zustand';

// Vue의 Pinia를 React의 Zustand로 대체
const useQuizStore = create((set, get) => ({
  // 상태
  currentQuestionIndex: 0,
  answers: [],
  
  // 퀴즈 데이터
  quizData: {
    title: 'Man vs Talmo',
    subtitle: '당신의 탈모 확률은?',
    description: 'AI 머신러닝 기반 탈모 위험도 측정 테스트',
    questions: [
      {
        id: 1,
        text: '당신의 나이대를 선택해주세요',
        type: 'age',
        options: [
          { id: '10+', text: '10대' },
          { id: '20+', text: '20대' },
          { id: '30+', text: '30대' },
          { id: '40+', text: '40대' },
          { id: '50+', text: '50대' },
          { id: '60+', text: '60대 이상' }
        ]
      },
      {
        id: 2,
        text: '성별을 선택해주세요',
        type: 'gender',
        options: [
          { id: 'male', text: '남성' },
          { id: 'female', text: '여성' }
        ]
      },
      {
        id: 3,
        text: '결혼 여부가 어떻게 되시나요?',
        type: 'is_married',
        options: [
          { id: 'Yes', text: '기혼' },
          { id: 'No', text: '미혼' }
        ]
      },
      {
        id: 4,
        text: '가족 중 탈모인이 있나요? (유전적 요인)',
        type: 'is_hereditary',
        options: [
          { id: 'Yes', text: '예' },
          { id: 'No', text: '아니오' }
        ]
      },
      {
        id: 5,
        text: '현재 키는 몇 cm인가요?',
        type: 'height',
        inputType: 'number',
        placeholder: '키를 입력해주세요 (cm)',
        min: 120,
        max: 220,
        step: 1
      },
      {
        id: 6,
        text: '현재 몸무게는 몇 kg인가요?',
        type: 'weight',
        inputType: 'number',
        placeholder: '몸무게를 입력해주세요 (kg)',
        min: 30,
        max: 200,
        step: 1
      },
      {
        id: 7,
        text: '흡연을 하시나요?',
        type: 'is_smoker',
        options: [
          { id: 'Yes', text: '예' },
          { id: 'No', text: '아니오' }
        ]
      },
      {
        id: 8,
        text: '현재 스트레스 수준은 어느 정도인가요?',
        type: 'stress',
        options: [
          { id: 'Level 1', text: '매우 낮음' },
          { id: 'Level 2', text: '낮음' },
          { id: 'Level 3', text: '보통' },
          { id: 'Level 4', text: '높음' }
        ]
      }
    ]
  },

  // Computed 값들 (Getter)
  getCurrentQuestion: () => {
    const state = get();
    return state.quizData.questions[state.currentQuestionIndex];
  },
  
  getProgress: () => {
    const state = get();
    return (state.currentQuestionIndex / state.quizData.questions.length) * 100;
  },
  
  getProgressText: () => {
    const state = get();
    return `${state.currentQuestionIndex + 1}/${state.quizData.questions.length}`;
  },
  
  isLastQuestion: () => {
    const state = get();
    return state.currentQuestionIndex === state.quizData.questions.length - 1;
  },

  // Actions
  selectAnswer: (optionId) => {
    set((state) => {
      const newAnswers = [...state.answers];
      newAnswers[state.currentQuestionIndex] = optionId;
      return { answers: newAnswers };
    });
  },
  
  nextQuestion: () => {
    set((state) => {
      if (state.currentQuestionIndex < state.quizData.questions.length - 1) {
        return { currentQuestionIndex: state.currentQuestionIndex + 1 };
      }
      return state;
    });
  },
  
  prevQuestion: () => {
    set((state) => {
      if (state.currentQuestionIndex > 0) {
        return { currentQuestionIndex: state.currentQuestionIndex - 1 };
      }
      return state;
    });
  },
  
  resetQuiz: () => {
    set({ currentQuestionIndex: 0, answers: [] });
  }
}));

export default useQuizStore;