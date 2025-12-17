/**
 * 공유 유틸리티 함수
 * 프론트엔드와 백엔드에서 공통으로 사용할 함수들을 정의합니다.
 */

// 예시: 날짜 포맷 함수
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// 예시: 유효성 검사 함수
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 필요한 다른 유틸리티 함수들을 여기에 추가하세요
