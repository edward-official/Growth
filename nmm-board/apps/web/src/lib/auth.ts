import api from './api';
import type { AuthCredentials, AuthResponse, User } from '@nmm-board/shared';

export const authService = {
  // 회원가입
  async signup(credentials: AuthCredentials): Promise<User> {
    const response = await api.post<User>('/auth/signup', credentials);
    return response.data;
  },

  // 로그인
  async signin(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signin', credentials);
    const { accessToken } = response.data;
    
    // 토큰 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('username', credentials.username);
    }
    
    return response.data;
  },

  // 로그아웃
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('username');
    }
  },

  // 로그인 상태 확인
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  },

  // 현재 사용자 이름 가져오기
  getCurrentUsername(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('username');
  },
};

export default authService;
