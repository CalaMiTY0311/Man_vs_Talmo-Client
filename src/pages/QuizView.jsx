import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuizStore from '../store/quizStore';

const QuizView = () => {
  const quizStore = useQuizStore();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [direction, setDirection] = useState(1); // 1: 다음, -1: 이전
  const [transitionKey, setTransitionKey] = useState(0);

  // 현재 질문 정보
  const currentQuestion = quizStore.getCurrentQuestion();
  const progress = quizStore.getProgress();
  const progressText = quizStore.getProgressText();
  const isLastQuestion = quizStore.isLastQuestion();

  // 페이지 전환 방향에 따른 애니메이션 설정
  const transitionName = direction > 0 ? 'slide-right' : 'slide-left';

  // 입력값 유효성 검사
  const isValidInput = () => {
    if (!currentQuestion.inputType) return true;
    
    const value = Number(inputValue);
    const min = Number(currentQuestion.min);
    const max = Number(currentQuestion.max);
    
    return !isNaN(value) && value >= min && value <= max && Number.isInteger(value);
  };

  // 이미지 오류 처리
  const handleImageError = (event) => {
    // 이미지 로드 실패 시 처리 - 이미지를 표시하지 않음
    event.target.style.display = 'none';
  };

  // 선택지 선택 (바로 다음 질문으로 이동)
  const selectOption = (optionId) => {
    // 답변 저장
    quizStore.selectAnswer(optionId);
    
    // 방향 설정
    setDirection(1);
    setTransitionKey(prev => prev + 1);
    
    // 마지막 질문이면 결과 페이지로 이동
    if (isLastQuestion) {
      navigate('/result');
    } else {
      // 다음 질문으로 이동
      quizStore.nextQuestion();
    }
  };

  // 수치 입력값 제출 (나이, 몸무게, 키)
  const submitInput = () => {
    if (!isValidInput()) return;
    
    // 정수로 변환
    const value = parseInt(inputValue);
    
    // 입력값이 유효하지 않으면 경고 표시
    if (isNaN(value)) {
      alert('유효한 정수를 입력해주세요.');
      return;
    }
    
    quizStore.selectAnswer(value);
    
    // 방향 설정
    setDirection(1);
    setTransitionKey(prev => prev + 1);
    
    // 마지막 질문이면 결과 페이지로 이동
    if (isLastQuestion) {
      navigate('/result');
    } else {
      // 다음 질문으로 이동
      quizStore.nextQuestion();
    }
  };

  // Enter 키 이벤트 처리
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && isValidInput()) {
      submitInput();
    }
  };

  // 이전 질문으로 이동
  const prevQuestion = () => {
    if (quizStore.currentQuestionIndex > 0) {
      setDirection(-1);
      setTransitionKey(prev => prev + 1);
      quizStore.prevQuestion();
    }
  };

  // 질문이 바뀔 때마다 저장된 답변 불러오기
  useEffect(() => {
    // 저장된 답변이 있는지 확인
    const savedAnswer = quizStore.answers[quizStore.currentQuestionIndex];
    
    if (savedAnswer !== undefined) {
      // 현재 질문 형태에 따라 입력값 설정
      if (currentQuestion.inputType === 'number') {
        setInputValue(savedAnswer);
      }
    } else {
      // 저장된 답변이 없으면 초기화
      setInputValue('');
    }
  }, [quizStore.currentQuestionIndex, currentQuestion]);

  // 초기화: 저장된 답변이 있으면 불러오기
  useEffect(() => {
    if (currentQuestion.inputType === 'number') {
      const savedAnswer = quizStore.answers[quizStore.currentQuestionIndex];
      if (savedAnswer !== undefined) {
        setInputValue(savedAnswer);
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
      
      {/* 진행 상태 */}
      <div className="w-full max-w-md mb-2">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between mt-1">
          {/* 뒤로가기 버튼 */}
          {quizStore.currentQuestionIndex > 0 ? (
            <button 
              onClick={prevQuestion} 
              className="text-sm flex items-center text-teal-400 hover:text-teal-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              뒤로
            </button>
          ) : (
            <div className="text-sm invisible">뒤로</div>
          )}
          <div className="text-sm text-gray-400">{progressText}</div>
        </div>
      </div>
      
      <div key={transitionKey} className={`transition-all duration-500 ease-in-out ${transitionName} w-full max-w-md`}>
        {/* 질문 */}
        <h2 className="text-3xl font-bold mb-4 text-center text-teal-400">Q{quizStore.currentQuestionIndex + 1}.</h2>
        
        {/* 질문 이미지 */}
        <div className="mb-6 flex justify-center">
          <img 
            src={`/images/questions/q${quizStore.currentQuestionIndex + 1}.jpg`} 
            className="w-32 h-32 object-contain rounded-lg" 
            alt={`질문 ${quizStore.currentQuestionIndex + 1} 이미지`}
            onError={handleImageError}
          />
        </div>
        
        <p className="text-lg mb-8 text-center">{currentQuestion.text}</p>
        
        {/* 입력 필드 (나이, 몸무게, 키) */}
        {currentQuestion.inputType === 'number' ? (
          <div className="mb-6">
            <input 
              type="number" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              min={currentQuestion.min}
              max={currentQuestion.max}
              step={1}
              placeholder={currentQuestion.placeholder}
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-teal-400"
              onKeyPress={handleKeyPress}
            />
            <button 
              onClick={submitInput}
              className={`btn mt-4 ${!isValidInput() ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isValidInput()}
            >
              다음
            </button>
          </div>
        ) : (
          /* 선택지 버튼 */
          <div className="space-y-3">
            {currentQuestion.options.map(option => (
              <button 
                key={option.id}
                onClick={() => selectOption(option.id)}
                className="btn"
              >
                {option.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;