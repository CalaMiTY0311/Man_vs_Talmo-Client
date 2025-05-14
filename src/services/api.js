import axios from 'axios';

// API 기본 URL 설정 (Vite에서는 환경 변수에 import.meta.env 접두사 사용)
const API_URL = import.meta.env.URL;

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 탈모 예측 API 호출 함수
export const predictBaldness = async (userData) => {
  try {
    const response = await apiClient.post('/predict', userData);
    return response.data;
  } catch (error) {
    console.error('탈모 예측 API 호출 중 오류 발생:', error);
    throw error;
  }
};

export default apiClient;