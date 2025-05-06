import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useQuizStore from '../store/quizStore';

const ResultView = () => {
  const quizStore = useQuizStore();
  const navigate = useNavigate();
  const [talmoPercent, setTalmoPercent] = useState(0);
  const [apiResult, setApiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRequesting, setIsRequesting] = useState(false); // 중복 요청 방지

  // 테스트 결과 검증
  useEffect(() => {
    // 모든 질문에 답변했는지 확인
    const anyAnswered = quizStore.answers.some(answer => answer !== undefined);
    
    // 결과 페이지에 직접 접근했거나 답변이 없는 경우 인트로 페이지로 리다이렉트
    if (!anyAnswered) {
      navigate('/');
      return;
    }
    
    // 이미 요청 중이면 중단
    if (isRequesting) return;
    
    setIsLoading(true);
    setIsRequesting(true); // 요청 시작
    
    // API 호출하여 결과 가져오기
    const fetchResults = async () => {
      try {
        // 모든 필드가 유효한 값을 가지고 있는지 확인
        const validateAnswer = (value) => {
          return value !== undefined && value !== null && value !== '';
        };

        // 모든 응답 검증
        const isValid = [
          validateAnswer(quizStore.answers[0]),
          validateAnswer(quizStore.answers[1]),
          validateAnswer(quizStore.answers[2]),
          validateAnswer(quizStore.answers[3]),
          validateAnswer(quizStore.answers[4]),
          validateAnswer(quizStore.answers[5]),
          validateAnswer(quizStore.answers[6]),
          validateAnswer(quizStore.answers[7])
        ].every(v => v);

        if (!isValid) {
          throw new Error('일부 필수 입력 항목이 누락되었습니다.');
        }

        // 키와 몸무게가 숫자임을 확인
        let height = parseFloat(quizStore.answers[4]);
        let weight = parseFloat(quizStore.answers[5]);
        let is_smoker = quizStore.answers[6];
        
        const apiData = {
          "age": quizStore.answers[0],
          "gender": quizStore.answers[1],
          "is_married": quizStore.answers[2],
          "is_hereditary": quizStore.answers[3],
          "height": height, 
          "weight": weight, 
          "is_smoker": is_smoker,
          "stress": quizStore.answers[7]
        };
        
        // API 요청
        const response = await axios.post('http://localhost:1542/predict', apiData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        // 서버 응답 확인
        if (response.data.success === false) {
          throw new Error(response.data.data);
        }
        
        // 성공적인 결과 처리
        setApiResult(response.data.data);
        setTalmoPercent(response.data.data.high_probability || 0);
      } catch (error) {
        console.error('API 호출 오류:', error);
        setErrorMessage('서버 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
        setIsRequesting(false); // 요청 종료
      }
    };

    fetchResults();
  }, []);

  // 위험도 레벨 계산
  const getRiskLevel = () => {
    const percent = talmoPercent;
    if (percent < 20) return '매우 낮음';
    if (percent < 40) return '낮음';
    if (percent < 60) return '보통';
    if (percent < 80) return '높음';
    return '매우 높음';
  };

  // 위험도에 따른 색상 지정
  const getRiskColorClass = () => {
    const percent = talmoPercent;
    if (percent < 20) return 'bg-green-500 text-green-500';
    if (percent < 40) return 'bg-teal-500 text-teal-500';
    if (percent < 60) return 'bg-yellow-500 text-yellow-500';
    if (percent < 80) return 'bg-orange-500 text-orange-500';
    return 'bg-red-500 text-red-500';
  };

  // 결과 설명 생성
  const getResultDescription = () => {
    const percent = talmoPercent;
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
  const getResultDetail = () => {
    const answers = quizStore.answers;
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

  // 결과 공유 기능
  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: '탈모 확률 테스트 결과',
        text: `내 탈모 발생 확률은 ${talmoPercent}%입니다.`,
        url: window.location.href
      }).catch(err => {
        alert('결과 공유 중 오류가 발생했습니다.');
      });
    } else {
      alert('이 브라우저에서는 공유 기능을 지원하지 않습니다.');
    }
  };

  // 테스트 다시 시작
  const restartQuiz = () => {
    quizStore.resetQuiz();
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 page-content">
      {/* 로딩 인디케이터 */}
      {isLoading ? (
        <div className="my-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
          <p className="mt-2 text-sm">AI 모델이 결과를 분석 중입니다...</p>
        </div>
      ) : (
        <div className="w-full max-w-xs result-container">
          {/* 오류 페이지 */}
          {errorMessage ? (
            <div className="mb-3">
              {/* 오류 아이콘 */}
              <div className="flex justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* 오류 메시지 */}
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded relative mb-3">
                <h2 className="text-base font-bold mb-1 text-center">서버 연결 오류</h2>
                <p className="text-sm text-center">서버 연결에 실패했습니다.</p>
              </div>
              
              {/* 시작 페이지로 바로 가기 버튼 */}
              <div className="flex justify-center">
                <button onClick={restartQuiz} className="btn py-1.5 px-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  시작 페이지로 돌아가기
                </button>
              </div>
            </div>
          ) : (
            /* 결과 컨텐츠 (오류가 없을 때만 표시) */
            <div>
              {/* 결과 타이틀 */}
              <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center text-teal-400">당신의 탈모 확률 결과</h1>
              
              {/* 확률 그래프 */}
              <div className="w-full mb-3">
                <div className="bg-gray-900 rounded-lg p-2 sm:p-3 relative overflow-hidden result-card">
                  <div className="text-3xl sm:text-4xl font-bold text-center mb-1 percentage">{talmoPercent}%</div>
                  <div className="text-center text-sm mb-2">탈모 발생 확률</div>
                  
                  {/* 확률 표시 바 */}
                  <div className="h-3 sm:h-4 bg-gray-800 rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full rounded-full ${getRiskColorClass()}`}
                      style={{ width: `${talmoPercent}%` }}
                    ></div>
                  </div>
                  
                  {/* 위험도 상태 */}
                  <div className={`text-center text-sm font-semibold mb-1 ${getRiskColorClass()} risk-level`}>
                    {getRiskLevel()}
                  </div>
                  <div className="text-center text-xs text-gray-400">위험도 레벨</div>
                </div>
              </div>
              
              {/* API 결과 정보 */}
              {apiResult && (
                <div className="w-full mb-3 bg-gray-900 rounded-lg p-2 result-card">
                  <div className="flex justify-between mb-1 text-xs">
                    <span className="font-semibold">결과 예측</span>
                    <span className={`font-bold ${apiResult.prediction === 'High' ? 'text-red-500' : 'text-green-500'}`}>
                      {apiResult.prediction === 'High' ? '위험' : '안전'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold">AI 모델 정확도</span>
                    <span className="font-bold">약 80%</span>
                  </div>
                </div>
              )}
              
              {/* 결과 설명 */}
              <div className="bg-gray-900 rounded-lg p-2 sm:p-3 w-full mb-3 result-card">
                <p className="text-sm font-semibold text-center mb-2">
                  데이터 분석 결과:
                </p>
                <div className="text-xs mb-2">
                  <p>{getResultDescription()}</p>
                </div>
                <div className="mt-2 p-1.5 bg-gray-800 rounded-lg">
                  <h3 className="text-xs font-bold mb-1">결과 해석</h3>
                  <p className="text-xs text-gray-300">{getResultDetail()}</p>
                </div>
              </div>
              
              {/* 주의사항 */}
              <div className="text-center text-xs text-gray-500 w-full mb-4">
                <p>
                  이 테스트 결과는 인공지능 기반 예측으로<br />정확한 의학적 진단이 아닙니다.
                </p>
              </div>
              
              {/* 결과 공유 & 재시작 버튼 - 작은 크기로 하단에 배치 */}
              <div className="flex w-full space-x-2 mb-3 action-buttons">
                <button onClick={shareResult} className="btn py-1 px-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs action-button">결과 공유하기</button>
                <button onClick={restartQuiz} className="btn py-1 px-1.5 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-xs action-button">테스트 다시하기</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultView;