import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuizStore from '../store/quizStore';
import { predictBaldness } from '../services/api';

const ResultView = () => {
  const navigate = useNavigate();
  const quizStore = useQuizStore();
  const answers = quizStore.answers;
  
  // 결과 상태
  const [talmoPercent, setTalmoPercent] = useState(0);
  const [apiResult, setApiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // 탈모 위험도 레벨
  const getRiskLevel = (percent) => {
    if (percent < 20) return '매우 낮음';
    if (percent < 40) return '낮음';
    if (percent < 60) return '보통';
    if (percent < 80) return '높음';
    return '매우 높음';
  };

  // 위험도 색상 클래스
  const getRiskColorClass = (percent) => {
    if (percent < 20) return 'bg-green-500 text-green-500';
    if (percent < 40) return 'bg-teal-500 text-teal-500';
    if (percent < 60) return 'bg-yellow-500 text-yellow-500';
    if (percent < 80) return 'bg-orange-500 text-orange-500';
    return 'bg-red-500 text-red-500';
  };

  // 결과 설명 생성
  const getResultDescription = (percent) => {
    if (percent < 20) {
      return '탈모 발생 확률이 매우 낮습니다. 현재 건강한 두피와 모발 상태를 유지하고 계신 것으로 보입니다.';
    } else if (percent < 40) {
      return '탈모 발생 확률이 낮은 편입니다. 현재 상태를 유지하며 간단한 모발 관리를 하시면 좋을 것 같습니다.';
    } else if (percent < 60) {
      return '탈모 발생 확률이 보통 수준입니다. 스트레스 관리와 두피 관리에 조금 더 신경 쓰시면 좋겠습니다.';
    } else if (percent < 80) {
      return '탈모 발생 확률이 높은 편입니다. 전문적인 두피 관리와 생활습관 개선을 고려해보시길 권장합니다.';
    } else {
      return '탈모 발생 확률이 매우 높습니다. 전문의와 상담하여 적절한 관리 방법을 찾아보시길 권장합니다.';
    }
  };

  // 결과 상세 설명
  const getResultDetail = (answers) => {
    let details = [];

    // 나이 관련
    if (answers[0] === '40+' || answers[0] === '50+' || answers[0] === '60+') {
      details.push('연령이 높아질수록 탈모의 발생 가능성이 증가합니다.');
    }

    // 성별 관련
    if (answers[1] === 'male') {
      details.push('남성은 여성보다 유전성 탈모가 발생할 확률이 더 높습니다.');
    }

    // 유전 관련
    if (answers[3] === 'Yes') {
      details.push('가족력이 있는 경우 탈모 발생 확률이 더 높아집니다.');
    }

    // 흡연 관련
    if (answers[6] === 'Yes') {
      details.push('흡연은 모발 성장에 필요한 영양분과 산소의 공급을 저해할 수 있습니다.');
    }

    // 스트레스 관련
    if (answers[7] === 'Level 3' || answers[7] === 'Level 4') {
      details.push('높은 스트레스는 모발 성장 주기에 영향을 미쳐 탈모를 촉진할 수 있습니다.');
    }

    if (details.length === 0) {
      return '현재 입력하신 데이터에서는 특별한 위험 요소가 발견되지 않았습니다.';
    }

    return details.join(' ');
  };

  // 질문 레이블 가져오기
  const getQuestionLabel = (index) => {
    const questions = quizStore.quizData.questions;
    if (!questions[index]) return `질문 ${index + 1}`;
    
    return questions[index].text.replace(/\?/g, '').trim();
  };

  // 답변 포맷팅
  const formatAnswer = (index, answer) => {
    if (answer === undefined) return '-';
    
    const question = quizStore.quizData.questions[index];
    
    // 입력 필드 형식 (배열 인덱스 체크)
    if (index === 4 || index === 5) { // 키(4) 또는 몸무게(5)
      if (question.type === 'height') return `${answer}cm`;
      if (question.type === 'weight') return `${answer}kg`;
      return `${answer}`;
    }
    
    // 선택지 형식
    if (question.options) {
      const option = question.options.find(opt => opt.id === answer);
      return option ? option.text : `${answer}`;
    }
    
    return `${answer}`;
  };

  // 테스트 다시 시작
  const restartQuiz = () => {
    quizStore.resetQuiz();
    navigate('/');
  };

  // 결과 공유 기능
  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: '탈모 확률 테스트 결과',
        text: `내 탈모 발생 확률은 ${talmoPercent}%입니다. 당신의 탈모 확률도 확인해보세요!`,
        url: window.location.href
      }).catch(err => {
        alert('결과 공유 중 오류가 발생했습니다.');
        console.error('공유 오류:', err);
      });
    } else {
      alert('이 브라우저에서는 공유 기능을 지원하지 않습니다.');
    }
  };

  // 퀴즈 답변을 API에 맞는 형식으로 변환
  const formatAnswersForAPI = () => {
    const questions = quizStore.quizData.questions;
    const formattedData = {};
    
    questions.forEach((question, index) => {
      const answer = answers[index];
      const key = question.type;
      
      // 키와 몸무게는 숫자로 변환
      if (key === 'height' || key === 'weight') {
        formattedData[key] = parseFloat(answer);
      } else {
        formattedData[key] = answer;
      }
    });
    
    return formattedData;
  };

  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    // 답변이 없으면 처음으로 리다이렉트
    if (answers.length === 0) {
      navigate('/');
      return;
    }
    
    const fetchPrediction = async () => {
      try {
        setIsLoading(true);
        const userData = formatAnswersForAPI();
        
        const response = await predictBaldness(userData);
        
        if (response && response.success === true && response.data) {
          setApiResult(response.data);
          // High_probability 또는 high_probability 둘 다 확인
          const highProb = response.data.High_probability || response.data.high_probability || 0;
          setTalmoPercent(highProb);
        } else {
          setErrorMessage('서버에서 유효한 응답을 반환하지 않았습니다.');
        }
      } catch (err) {
        console.error('예측 중 오류 발생:', err);
        setErrorMessage('서버 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrediction();
  }, [answers, navigate]);

  // 스크롤 스타일 설정
  const contentStyle = {
    height: 'auto',
    width: '100%',
    overflow: 'auto'
  };

  return (
    <div style={contentStyle}>
      <div className="flex flex-col items-center p-4 sm:p-6">
        {/* 로딩 인디케이터 */}
        {isLoading ? (
          <div className="my-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            <p className="mt-4 text-lg">AI 모델이 결과를 분석 중입니다...</p>
          </div>
        ) : (
          <div className="w-full max-w-md">
            {/* 오류 페이지 */}
            {errorMessage ? (
              <div className="w-full mb-6">
                {/* 오류 아이콘 */}
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>

                {/* 오류 메시지 */}
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                  <h2 className="text-xl font-bold mb-2 text-center">서버 연결 오류</h2>
                  <p className="mb-2 text-center">서버 연결에 실패했습니다.</p>
                </div>
                
                {/* 시작 페이지로 바로 가기 버튼 */}
                <div className="flex justify-center">
                  <button onClick={restartQuiz} className="btn py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    시작 페이지로 돌아가기
                  </button>
                </div>
              </div>
            ) : (
              /* 결과 컨텐츠 (오류가 없을 때만 표시) */
              <div className="w-full">
                {/* 결과 타이틀 */}
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-center text-teal-400">당신의 탈모 확률 결과</h1>
                
                {/* 확률 그래프 */}
                <div className="w-full mb-6 sm:mb-8">
                  <div className="bg-gray-900 rounded-lg p-4 sm:p-6 relative overflow-hidden">
                    <div className="text-5xl sm:text-6xl font-bold text-center mb-2">{talmoPercent}%</div>
                    <div className="text-center text-lg mb-4 sm:mb-6">탈모 발생 확률</div>
                    
                    {/* 확률 표시 바 */}
                    <div className="h-6 sm:h-8 bg-gray-800 rounded-full overflow-hidden mb-3 sm:mb-4">
                      <div 
                        className={`h-full rounded-full ${getRiskColorClass(talmoPercent)}`}
                        style={{ width: `${talmoPercent}%` }}
                      ></div>
                    </div>
                    
                    {/* 위험도 상태 */}
                    <div className={`text-center text-lg font-semibold mb-1 ${getRiskColorClass(talmoPercent)}`}>
                      {getRiskLevel(talmoPercent)}
                    </div>
                    <div className="text-center text-sm text-gray-400">위험도 레벨</div>
                  </div>
                </div>
                
                {/* API 결과 정보 */}
                {apiResult && (
                  <div className="w-full mb-4 bg-gray-900 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">결과 예측</span>
                      <span className={`font-bold ${apiResult.prediction === 'High' ? 'text-red-500' : 'text-green-500'}`}>
                        {apiResult.prediction === 'High' ? '위험' : '안전'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">AI 모델 정확도</span>
                      <span className="font-bold">약 80%</span>
                    </div>
                  </div>
                )}
                
                {/* 결과 설명 */}
                <div className="bg-gray-900 rounded-lg p-4 sm:p-6 w-full mb-6 sm:mb-8">
                  <p className="text-lg sm:text-xl text-center mb-3 sm:mb-4">
                    당신의 데이터 분석 결과:
                  </p>
                  <div className="text-base sm:text-lg mb-4">
                    <p>{getResultDescription(talmoPercent)}</p>
                  </div>
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-800 rounded-lg">
                    <h3 className="font-bold mb-2">결과 해석</h3>
                    <p className="text-sm text-gray-300">{getResultDetail(answers)}</p>
                  </div>
                </div>
                
                {/* 결과 공유 & 재시작 버튼 - 상단에 추가된 고정 버튼 */}
                <div className="sticky top-4 z-50 flex flex-col w-full space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 mb-6 bg-gray-900 p-3 rounded-lg shadow-lg">
                  <button onClick={shareResult} className="btn py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium">결과 공유하기</button>
                  <button onClick={restartQuiz} className="btn py-2 px-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium">테스트 다시하기</button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* 주의사항 */}
        <div className="mt-6 sm:mt-8 text-center text-xs text-gray-500 max-w-md px-2 mb-12">
          <p>
            이 테스트 결과는 인공지능 기반 예측으로 정확한 의학적 진단이 아닙니다.<br />
            탈모에 대한 정확한 진단은 전문의사와 상담하신 후 결정하시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultView;