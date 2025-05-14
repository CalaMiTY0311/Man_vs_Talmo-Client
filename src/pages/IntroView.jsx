import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuizStore from '../store/quizStore';

const IntroView = () => {
  const quizStore = useQuizStore();
  const navigate = useNavigate();
  
  // 슬라이더 상태 관리
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderIntervalRef = useRef(null);

  // 이미지 배열
  const [sliderImages] = useState([
    { src: '/images/slider/slide1.jpg', alt: '탈모 테스트 이미지 1' },
    { src: '/images/slider/slide2.jpg', alt: '탈모 테스트 이미지 2' },
    { src: '/images/slider/slide3.jpg', alt: '탈모 테스트 이미지 3' },
    { src: '/images/slider/slide4.jpg', alt: '탈모 테스트 이미지 4' }
  ]);

  // 기본 이미지 설정 (이미지가 없을 경우 대체 이미지)
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMxMTE4MjciIHJ4PSIxMCIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM1OWE2ZjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+TWFuIHZzIFRhbG1vPC90ZXh0Pgo8L3N2Zz4=';

  // 다음 슬라이드로 이동
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderImages.length);
  };

  // 이미지 로드 오류 처리
  const handleImageError = (event) => {
    console.log('Image failed to load:', event.target.src);
    event.target.src = fallbackImage;
  };

  // 컴포넌트 마운트 시 타이머 시작
  useEffect(() => {
    // 자동 슬라이드 설정
    sliderIntervalRef.current = setInterval(() => {
      nextSlide();
    }, 3000); // 3초마다 슬라이드 변경
    
    return () => {
      clearInterval(sliderIntervalRef.current);
    };
  }, []);

  // 퀴즈 초기화 및 시작
  const startQuiz = () => {
    quizStore.resetQuiz();
    navigate('/q');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 w-full">
      {/* 타이틀 */}
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-teal-400">Man vs Talmo</h1>
        <p className="text-lg sm:text-xl mb-3">{quizStore.quizData.subtitle}</p>
        <p className="text-xs sm:text-sm text-gray-400">AI 딥러닝 & 머신러닝 기반 탈모 위험도 측정 MBTI 테스트</p>
      </header>
      
      {/* 이미지 슬라이더 */}
      <section className="w-full max-w-xs sm:max-w-sm md:max-w-md mb-8">
        <div className="overflow-hidden rounded-lg shadow-lg bg-gray-900">
          {/* 슬라이더 컨테이너 */}
          <div 
            className="flex transition-transform duration-500 ease-in-out" 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            role="region"
            aria-label="탈모 테스트 슬라이드쇼"
          >
            {sliderImages.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0 bg-gray-900 flex items-center justify-center">
                <img 
                  src={image.src} 
                  className="w-full h-48 sm:h-56 md:h-64 object-contain bg-gray-900"
                  alt={image.alt}
                  onError={handleImageError}
                  loading="lazy"
                  style={{
                    // 모든 브라우저에서 일관된 이미지 표시
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    backgroundColor: '#111827' // gray-900
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 시작 버튼 */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md px-4">
        <button 
          onClick={startQuiz} 
          className="btn w-full text-base sm:text-lg font-bold py-3 px-6"
          aria-label="탈모 확률 검사 시작"
        >
          탈모 확률 검사 시작
        </button>
      </div>
      
      {/* 간단한 설명 */}
      <footer className="mt-6 text-center text-xs text-gray-500 max-w-xs sm:max-w-sm md:max-w-md px-4">
        <p>이 테스트는 8개의 질문을 통해 탈모 발생 확률을 예측합니다.<br/>인공지능 딥러닝 및 머신러닝 모델을 통한 분석 결과로, 정확한 의학적 진단이 아닙니다.</p>
      </footer>
    </main>
  );
};

export default IntroView;