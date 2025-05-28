import React from 'react';
import { useNavigate } from 'react-router-dom';
import useQuizStore from '../store/quizStore';

const IntroView = () => {
  const quizStore = useQuizStore();
  const navigate = useNavigate();

  // 기본 이미지 설정 (이미지가 없을 경우 대체 이미지)
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMxMTE4MjciIHJ4PSIxMCIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM1OWE2ZjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+TWFuIHZzIFRhbG1vPC90ZXh0Pgo8L3N2Zz4=';

  // 이미지 로드 오류 처리
  const handleImageError = (event) => {
    console.log('Image failed to load:', event.target.src);
    event.target.src = fallbackImage;
  };

  // 퀴즈 초기화 및 시작
  const startQuiz = () => {
    quizStore.resetQuiz();
    navigate('/q');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-2 w-full bg-black">
      {/* 타이틀 */}
      <header className="text-center mb-3">
        <h1 className="text-xl font-bold mb-1 text-teal-400">Man vs Talmo</h1>
        <p className="text-sm mb-1">{quizStore.quizData.subtitle}</p>
        <p className="text-[10px] text-gray-400">AI 딥러닝 & 머신러닝 기반 탈모 위험도 측정 테스트</p>
      </header>
      
      {/* 정적 이미지 */}
      <section className="w-full max-w-xs mb-3 p-2">
        <div className="overflow-hidden rounded-lg shadow-lg bg-gray-900">
          <div className="w-full flex items-center justify-center">
            <img 
              src="/images/slider/slide1.jpg" 
              className="w-full h-32 object-contain bg-gray-900"
              alt="탈모 테스트 이미지"
              onError={handleImageError}
              loading="eager"
            />
          </div>
        </div>
      </section>
      
      {/* 시작 버튼 */}
      <div className="w-full max-w-xs px-2">
        <button 
          onClick={startQuiz} 
          className="btn h-10 text-xs font-bold"
          aria-label="탈모 확률 검사 시작"
        >
          탈모 확률 검사 시작
        </button>
      </div>
      
      {/* 간단한 설명 */}
      <footer className="mt-2 text-center text-[10px] text-gray-500 max-w-xs px-2">
        <p>이 테스트는 8개의 질문을 통해 탈모 발생 확률을 예측합니다.<br/>인공지능 딥러닝 및 머신러닝 모델을 통한 분석 결과로, 정확한 의학적 진단이 아닙니다.</p>
      </footer>
    </main>
  );
};

export default IntroView;