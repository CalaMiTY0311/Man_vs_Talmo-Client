import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuizStore from '../store/quizStore';

const IntroView = () => {
  const quizStore = useQuizStore();
  const navigate = useNavigate();
  
  // 슬라이더 상태 관리
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderIntervalRef = useRef(null);
  const sliderContainerRef = useRef(null);

  // 이미지 배열
  const [sliderImages] = useState([
    { src: '/images/slider/slide1.jpg', alt: '탈모 테스트 이미지 1' },
    { src: '/images/slider/slide2.jpg', alt: '탈모 테스트 이미지 2' },
    { src: '/images/slider/slide3.jpg', alt: '탈모 테스트 이미지 3' },
    { src: '/images/slider/slide4.jpg', alt: '탈모 테스트 이미지 4' }
  ]);

  // 기본 이미지 설정 (이미지가 없을 경우 대체 이미지)
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMzMzMiIHJ4PSIxMCIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM1Y2Q1YzQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1hbiB2cyBUYWxtbzwvdGV4dD4KPC9zdmc+';

  // 다음 슬라이드로 이동
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderImages.length);
  };

  // 타이머 초기화
  const resetInterval = () => {
    clearInterval(sliderIntervalRef.current);
    sliderIntervalRef.current = setInterval(() => {
      nextSlide();
    }, 3000); // 3초마다 슬라이드 변경
  };

  // 이미지 로드 오류 처리
  const handleImageError = (index) => {
    const newImages = [...sliderImages];
    newImages[index].src = fallbackImage;
    // 여기서는 state를 직접 업데이트하지 않고 DOM을 조작
    const img = document.querySelector(`img[data-index="${index}"]`);
    if (img) img.src = fallbackImage;
  };

  // 컴포넌트 마운트 시 타이머 시작
  useEffect(() => {
    resetInterval();
    
    // 이미지 미리 로드
    sliderImages.forEach((image, index) => {
      const img = new Image();
      img.src = image.src;
      img.onload = () => console.log(`Image ${index} loaded`);
      img.onerror = () => handleImageError(index);
    });
    
    return () => {
      clearInterval(sliderIntervalRef.current);
    };
  }, []);

  // 퀴즈 초기화 및 시작
  const startQuiz = () => {
    quizStore.resetQuiz();
    navigate('/quiz');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full">
      {/* 타이틀 */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-center text-teal-400">Man vs Talmo</h1>
      <p className="text-lg sm:text-xl mb-3 text-center">{quizStore.quizData.subtitle}</p>
      <p className="text-xs sm:text-sm mb-6 text-center text-gray-400">{quizStore.quizData.description}</p>
      
      {/* 이미지 슬라이더 */}
      <div className="w-full max-w-xs sm:max-w-sm mb-6 relative overflow-hidden rounded-lg shadow-lg">
        {/* 슬라이더 컨테이너 */}
        <div 
          className="slider-container" 
          ref={sliderContainerRef} 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {sliderImages.map((image, index) => (
            <div key={index} className="slider-item">
              <img 
                src={image.src} 
                className="w-full h-48 sm:h-56 object-contain" 
                alt={image.alt}
                data-index={index}
                onError={() => handleImageError(index)}
                loading="lazy" 
              />
            </div>
          ))}
        </div>
        
        {/* 슬라이더 인디케이터 */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${currentSlide === index ? 'bg-teal-400' : 'bg-gray-400'}`}
              onClick={() => {
                setCurrentSlide(index);
                resetInterval();
              }}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* 시작 버튼 */}
      <button onClick={startQuiz} className="btn max-w-xs sm:max-w-sm text-base sm:text-lg font-bold py-3">
        탈모 확률 검사 시작
      </button>
      
      {/* 간단한 설명 */}
      <div className="mt-6 text-center text-xs text-gray-500 max-w-xs sm:max-w-sm">
        <p>이 테스트는 8개의 질문을 통해 탈모 발생 확률을 예측합니다.<br/>기계학습 모델을 통한 분석 결과로, 정확한 의학적 진단이 아닙니다.</p>
      </div>
    </div>
  );
};

export default IntroView;