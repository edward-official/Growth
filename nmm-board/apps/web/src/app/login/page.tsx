'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiLock } from 'react-icons/fi';
import authService from '@/lib/auth';
import type { AuthCredentials } from '@nmm-board/shared';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('사용자명과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const credentials: AuthCredentials = { username, password };

      if (isLogin) {
        await authService.signin(credentials);
        router.push('/');
      } else {
        await authService.signup(credentials);
        setError('');
        setIsLogin(true);
        setPassword('');
        alert('회원가입이 완료되었습니다. 로그인해주세요.');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      console.error('Response data:', err.response?.data);
      
      let errorMessage = isLogin ? '로그인에 실패했습니다.' : '회원가입에 실패했습니다.';
      
      if (err.response?.data?.message) {
        // 배열인 경우 (validation 에러)
        if (Array.isArray(err.response.data.message)) {
          errorMessage = err.response.data.message.join(' / ');
        } else {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Board App
          </h1>
          <p className="text-gray-600">간단한 게시판 애플리케이션</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              isLogin
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              !isLogin
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사용자명
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                placeholder="사용자명을 입력하세요"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                placeholder="비밀번호를 입력하세요"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 shadow-lg"
            disabled={isLoading}
          >
            {isLoading
              ? '처리 중...'
              : isLogin
              ? '로그인'
              : '회원가입'}
          </button>
        </form>
      </div>
    </div>
  );
}
