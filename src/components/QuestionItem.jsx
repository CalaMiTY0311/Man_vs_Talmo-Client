import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

/**
 * 질문 컴포넌트 - 개별 질문을 표시하고 애니메이션을 적용
 */
const QuestionItem = ({ 
  question, 
  index, 
  inputValue, 
  setInputValue, 
  handleKeyPress, 
  isValidInput, 
  submitInput, 
  selectOption 
}) => {
  const nodeRef = useRef(null);

  return (
    <div ref={nodeRef} className="w-full">
      <article className="w-full max-w-xs mx-auto p-2">
        {/* 질문 */}
        <header>
          <h2 className="text-base font-bold mb-2 text-center text-teal-400">Q{index + 1}.</h2>
        </header>
        
        <p className="text-xs mb-3 text-center">{question.text}</p>
        
        {/* 입력 필드 또는 선택지 버튼 */}
        {question.inputType === 'number' ? (
          <section className="mb-3" aria-label="수치 입력">
            <input 
              type="number" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              min={question.min}
              max={question.max}
              step={1}
              placeholder={question.placeholder}
              className="w-full px-2 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-teal-400 text-xs"
              onKeyPress={handleKeyPress}
              aria-label={question.placeholder}
            />
            <button 
              onClick={submitInput}
              className={`btn mt-2 ${!isValidInput() ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isValidInput()}
              aria-label="다음 질문으로 이동"
            >
              다음
            </button>
          </section>
        ) : question.options ? (
          <section className="space-y-1.5" aria-label="선택지">
            {question.options.map((option) => (
              <button 
                key={option.id}
                onClick={() => selectOption(option.id)}
                className="btn w-full h-10 flex items-center justify-center text-xs"
                aria-label={option.text}
              >
                {option.text}
              </button>
            ))}
          </section>
        ) : null}
      </article>
    </div>
  );
};

export default QuestionItem;