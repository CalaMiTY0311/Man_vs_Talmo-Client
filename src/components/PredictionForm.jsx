import React, { useState, useRef } from 'react';
import { predictBaldness } from '../services/api';

const PredictionForm = () => {
  // 기본 폼 데이터 상태
  const [formData, setFormData] = useState({
    age: '30+',
    gender: 'male',
    is_hereditary: 'No',
    stress: 'Level 3',
    is_married: 'No',
    height: 174.0,
    weight: 75.0,
    is_smoker: 'No'
  });
  
  // 결과, 로딩, 오류 상태
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 결과 섹션으로 스크롤하기 위한 ref
  const resultRef = useRef(null);
  
  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // 숫자 값 처리
    if (name === 'height' || name === 'weight') {
      processedValue = parseFloat(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };
  
  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // API 호출
      const response = await predictBaldness(formData);
      console.log('API 응답:', response);
      
      // 응답 데이터 구조 확인
      if (response && response.success === true && response.data) {
        setResult(response.data);
        
        // 결과가 표시된 후 스크롤
        setTimeout(() => {
          if (resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        setError('서버에서 유효한 응답을 반환하지 않았습니다.');
        console.error('유효하지 않은 응답:', response);
      }
    } catch (err) {
      setError('예측 중 오류가 발생했습니다. 다시 시도해 주세요.');
      console.error('에러 상세 정보:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">탈모 예측 테스트</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 나이 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
          <select
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="10+">10대</option>
            <option value="20+">20대</option>
            <option value="30+">30대</option>
            <option value="40+">40대</option>
            <option value="50+">50대</option>
            <option value="60+">60대 이상</option>
          </select>
        </div>
        
        {/* 성별 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">남성</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">여성</span>
            </label>
          </div>
        </div>
        
        {/* 유전적 요인 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">가족 중 탈모가 있나요?</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="is_hereditary"
                value="Yes"
                checked={formData.is_hereditary === 'Yes'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">예</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="is_hereditary"
                value="No"
                checked={formData.is_hereditary === 'No'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">아니오</span>
            </label>
          </div>
        </div>
        
        {/* 스트레스 레벨 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">스트레스 수준</label>
          <select
            name="stress"
            value={formData.stress}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Level 1">Level 1 (낮음)</option>
            <option value="Level 2">Level 2 (보통)</option>
            <option value="Level 3">Level 3 (높음)</option>
            <option value="Level 4">Level 4 (매우 높음)</option>
          </select>
        </div>
        
        {/* 결혼 여부 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">결혼 여부</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="is_married"
                value="Yes"
                checked={formData.is_married === 'Yes'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">기혼</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="is_married"
                value="No"
                checked={formData.is_married === 'No'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">미혼</span>
            </label>
          </div>
        </div>
        
        {/* 키와 몸무게 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">키 (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              min="100"
              max="250"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">몸무게 (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="30"
              max="200"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* 흡연 여부 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">흡연 여부</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="is_smoker"
                value="Yes"
                checked={formData.is_smoker === 'Yes'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">예</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="is_smoker"
                value="No"
                checked={formData.is_smoker === 'No'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">아니오</span>
            </label>
          </div>
        </div>
        
        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition duration-200 disabled:bg-blue-300"
        >
          {loading ? '예측 중...' : '탈모 가능성 예측하기'}
        </button>
      </form>
      
      {/* 결과 표시 */}
      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {result && !error && (
        <div ref={resultRef} className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">예측 결과</h3>
          <p className="text-gray-700">
            <span className="font-medium">대머리 가능성:</span> {result.prediction}
          </p>
          
          {/* 확률 표시 (API 응답 구조에 따라 조정 필요) */}
          {result.High_probability !== undefined && (
            <div className="mt-2">
              <p className="text-gray-700">
                <span className="font-medium">탈모 확률:</span> {result.High_probability}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${result.High_probability}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <h4 className="font-medium text-gray-800 mb-1">조언:</h4>
            {result.prediction === 'High' ? (
              <ul className="list-disc pl-5 text-gray-700 text-sm">
                <li>정기적으로 두피 건강을 체크하세요.</li>
                <li>스트레스 관리가 중요합니다.</li>
                <li>두피 마사지를 통해 혈액순환을 촉진하세요.</li>
                <li>균형 잡힌 식단을 유지하세요.</li>
              </ul>
            ) : (
              <ul className="list-disc pl-5 text-gray-700 text-sm">
                <li>현재 대머리 위험은 낮지만 꾸준한 두피 관리가 필요합니다.</li>
                <li>스트레스 관리와 균형 잡힌 식단을 유지하세요.</li>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
