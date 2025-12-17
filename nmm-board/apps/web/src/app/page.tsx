'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus } from 'react-icons/fi';
import BoardCard from '@/components/BoardCard';
import CreateBoardModal from '@/components/CreateBoardModal';
import Navbar from '@/components/Navbar';
import boardService from '@/lib/boards';
import authService from '@/lib/auth';
import type { Board } from '@nmm-board/shared';

export default function Home() {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 6;
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 로그인 체크
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadBoards(1);
  }, [router]);

  const loadBoards = async (targetPage = page) => {
    try {
      setIsLoading(true);
      const data = await boardService.getAllBoards(targetPage, limit);
      setBoards(data.data);
      setTotal(data.total);
      setPage(targetPage);
      setError('');
    } catch (err: any) {
      console.error('Load boards error:', err.response);
      
      // 401 에러면 로그인 페이지로
      if (err.response?.status === 401) {
        authService.logout();
        router.push('/login');
        return;
      }
      
      setError('게시글을 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    loadBoards(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const handlePrev = () => {
    if (canGoPrev) loadBoards(page - 1);
  };
  const handleNext = () => {
    if (canGoNext) loadBoards(page + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              게시판
            </h1>
            <p className="text-gray-600">
              총 {total}개의 게시글이 있습니다
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 font-medium"
          >
            <FiPlus size={20} />
            새 게시글
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : boards.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">
              아직 게시글이 없습니다
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              첫 게시글을 작성해보세요 →
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                이전
              </button>
              <div className="text-gray-700">
                {page} / {totalPages}
              </div>
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                다음
              </button>
            </div>
          </>
        )}
      </main>

      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
