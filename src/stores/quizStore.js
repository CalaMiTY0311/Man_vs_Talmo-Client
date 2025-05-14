import { create } from 'zustand';

export const useQuizStore = create((set) => ({
  currentQuestion: 0,
  answers: {},
  
  // 답변 저장
  saveAnswer: (questionId, answer) => 
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer }
    })),
  
  // 다음 질문으로 이동
  nextQuestion: () => 
    set((state) => ({
      currentQuestion: state.currentQuestion + 1
    })),
  
  // 이전 질문으로 이동
  prevQuestion: () => 
    set((state) => ({
      currentQuestion: Math.max(0, state.currentQuestion - 1)
    })),
  
  // 모든 상태 초기화
  resetQuiz: () => 
    set({
      currentQuestion: 0,
      answers: {}
    })
}));
