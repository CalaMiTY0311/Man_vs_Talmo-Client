import React, { useState, useEffect, useCallback, Fragment, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import useQuizStore from '../store/quizStore';
import { Dialog, Transition } from '@headlessui/react';
import QuestionItem from '../components/QuestionItem';

/**
 * QuizView 컴포넌트 - 사용자에게 질문을 순차적으로 제시하는 화면
 */
const QuizView = () => {
  // 상태 관리 및 네비게이션 훅
  const quizStore = useQuizStore();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const nodeRef = useRef(null);

  // 현재 질문 정보
  const currentQuestion = quizStore.getCurrentQuestion ? quizStore.getCurrentQuestion() : null;
  const progress = quizStore.getProgress ? quizStore.getProgress() : 0;
  const progressText = quizStore.getProgressText ? quizStore.getProgressText() : '';
  const isLastQuestion = quizStore.isLastQuestion ? quizStore.isLastQuestion() : false;

  // 입력값 유효성 검사
  const isValidInput = useCallback(() => {
    if (!currentQuestion || !currentQuestion.inputType) return true;
    
    const value = Number(inputValue);
    const min = Number(currentQuestion.min);
    const max = Number(currentQuestion.max);
    
    return !isNaN(value) && value >= min && value <= max && Number.isInteger(value);
  }, [currentQuestion, inputValue]);

  // 선택지 선택 처리
  const selectOption = useCallback((optionId) => {
    quizStore.selectAnswer(optionId);
    
    if (isLastQuestion) {
      setShowModal(true);
    } else {
      quizStore.nextQuestion();
    }
  }, [quizStore, isLastQuestion]);

  // 수치 입력값 제출 처리
  const submitInput = useCallback(() => {
    if (!isValidInput()) return;
    
    const value = parseInt(inputValue);
    
    if (isNaN(value)) {
      alert('유효한 정수를 입력해주세요.');
      return;
    }
    
    quizStore.selectAnswer(value);
    
    if (isLastQuestion) {
      setShowModal(true);
    } else {
      quizStore.nextQuestion();
    }
  }, [inputValue, isValidInput, quizStore, isLastQuestion]);

  // Enter 키 이벤트 처리
  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter' && isValidInput()) {
      submitInput();
    }
  }, [isValidInput, submitInput]);

  // 이전 질문으로 이동
  const prevQuestion = useCallback(() => {
    if (quizStore.currentQuestionIndex > 0) {
      quizStore.prevQuestion();
    }
  }, [quizStore]);
  
  // 모달 확인 버튼 처리
  const handleModalConfirm = useCallback(() => {
    setShowModal(false);
    navigate('/result');
  }, [navigate]);

  // 질문이 바뀔 때마다 저장된 답변 불러오기
  useEffect(() => {
    // 저장된 답변이 있는지 확인
    const savedAnswer = quizStore.answers[quizStore.currentQuestionIndex];
    
    if (savedAnswer !== undefined && currentQuestion && currentQuestion.inputType === 'number') {
      setInputValue(savedAnswer);
    } else {
      setInputValue('');
    }
  }, [quizStore.currentQuestionIndex, quizStore.answers, currentQuestion]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-3 sm:p-4 bg-black mobile-compact">
      {/* 진행 상태 */}
      <nav className="w-full max-w-xs sm:max-w-sm mb-2 sm:mb-4 compact-container" aria-label="탈모 테스트 진행도">
        <div className="progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between mt-1">
          {/* 뒤로가기 버튼 */}
          {quizStore.currentQuestionIndex > 0 ? (
            <button 
              onClick={prevQuestion} 
              className="text-xs sm:text-sm flex items-center text-teal-400 hover:text-teal-500"
              aria-label="이전 질문으로 이동"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              뒤로
            </button>
          ) : (
            <div className="text-xs sm:text-sm invisible">뒤로</div>
          )}
          <div className="text-xs sm:text-sm text-gray-400">{progressText}</div>
        </div>
      </nav>
      
      {/* 질문 영역 - 애니메이션 적용 */}
      <div className="w-full max-w-xs relative" style={{ minHeight: '200px' }}>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={quizStore.currentQuestionIndex}
            timeout={300}
            classNames="question-slide"
            nodeRef={nodeRef}
          >
            <div ref={nodeRef} className="question-container">
              {currentQuestion && (
                <QuestionItem
                  question={currentQuestion}
                  index={quizStore.currentQuestionIndex}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  handleKeyPress={handleKeyPress}
                  isValidInput={isValidInput}
                  submitInput={submitInput}
                  selectOption={selectOption}
                />
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>

      {/* 참고사항 모달 - Headless UI Dialog 사용 */}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xs sm:max-w-sm transform overflow-hidden rounded-lg bg-gray-800 p-4 sm:p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold mb-3 text-teal-400"
                  >
                    탈모 검사 참고사항
                  </Dialog.Title>
                  <div className="space-y-3">
                    <p className="text-sm">이 탈모 테스트는 다음과 같은 사항을 참고해주세요:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>이 검사는 AI 모델을 통한 통계적 분석이며, 정확한 진단이 아닙니다.</li>
                      <li>보다 정확한 진단을 위해서는 전문 의사와 상담하시기 바랍니다.</li>
                      <li>이 검사는 중증의 탈모 발견에 대한 도구가 아니며, 탈모 발생 가능성을 추정하는 모델입니다.</li>
                      <li>결과는 유전적 요인, 스트레스, 식이요법, 생활습관 등의 정보를 토대로 예측합니다.</li>
                    </ul>
                    <p className="mt-3 text-sm">계속해서 결과를 확인하시겠습니까?</p>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                      onClick={handleModalConfirm}
                    >
                      확인하고 결과 보기
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </main>
  );
};

export default QuizView;