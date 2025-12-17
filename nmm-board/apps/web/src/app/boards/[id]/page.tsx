'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import boardService from '@/lib/boards';
import authService from '@/lib/auth';
import type { Board } from '@nmm-board/shared';
import { BoardStatus } from '@nmm-board/shared';

export default function BoardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params); // Promise를 unwrap
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentError, setCommentError] = useState('');
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadBoard();
  }, [id, router]);

  const loadBoard = async () => {
    try {
      setIsLoading(true);
      const data = await boardService.getBoardById(Number(id));
      console.log('Loaded board:', data);
      console.log('Board user:', data.user);
      console.log('Current user:', authService.getCurrentUsername());
      setBoard(data);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('비공개 게시글입니다. 작성자만 볼 수 있습니다.');
      } else if (err.response?.status === 404) {
        setError('게시글을 찾을 수 없습니다.');
      } else {
        setError('게시글을 불러오는데 실패했습니다.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!board) return;

    const newStatus =
      board.status === BoardStatus.PUBLIC
        ? BoardStatus.PRIVATE
        : BoardStatus.PUBLIC;

    try {
      const updated = await boardService.updateBoardStatus(board.id, newStatus);
      setBoard(updated);
    } catch (err: any) {
      alert('상태 변경에 실패했습니다.');
      console.error(err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!board) return;
    const content = commentContent.trim();
    if (!content) {
      setCommentError('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setIsCommentSubmitting(true);
      setCommentError('');
      const newComment = await boardService.createComment(board.id, content);
      setBoard((prev) =>
        prev
          ? {
              ...prev,
              comments: [...(prev.comments ?? []), newComment],
            }
          : prev
      );
      setCommentContent('');
    } catch (err: any) {
      if (err.response?.status === 403) {
        setCommentError('댓글 작성 권한이 없습니다.');
      } else {
        setCommentError('댓글 작성에 실패했습니다.');
      }
      console.error(err);
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!board) return;

    if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await boardService.deleteBoard(board.id);
      router.push('/');
    } catch (err: any) {
      alert('삭제에 실패했습니다.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 font-medium"
        >
          <FiArrowLeft />
          뒤로 가기
        </button>

        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl">
            {error}
          </div>
        ) : board ? (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {board.title}
                </h1>
                {board.user && (
                  <p className="text-gray-600">
                    작성자: <span className="font-medium">{board.user.username}</span>
                  </p>
                )}
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  board.status === BoardStatus.PUBLIC
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {board.status}
              </span>
            </div>

            <div className="border-t pt-6 mb-6">
              <p className="text-gray-700 text-lg whitespace-pre-wrap">
                {board.description}
              </p>
            </div>

            {/* 작성자만 수정/삭제 버튼 표시 */}
            {board.user && authService.getCurrentUsername() === board.user.username ? (
              <div className="flex gap-3">
                <button
                  onClick={handleStatusToggle}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
                >
                  {board.status === BoardStatus.PUBLIC
                    ? 'PRIVATE로 변경'
                    : 'PUBLIC으로 변경'}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
                >
                  <FiTrash2 />
                  삭제
                </button>
              </div>
            ) : (
              <div className="text-gray-500 text-sm py-3">
                이 게시글은 다른 사용자가 작성했습니다.
              </div>
            )}

            {/* 댓글 영역 */}
            <div className="mt-10 border-t pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">댓글</h2>

              <div className="space-y-4 mb-6">
                {board.comments && board.comments.length > 0 ? (
                  board.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-600">
                          {comment.user?.username ?? '알 수 없는 사용자'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleString()
                            : ''}
                        </div>
                      </div>
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">
                    아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
                  </div>
                )}
              </div>

              <div className="mt-4">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="댓글을 입력하세요"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
                {commentError && (
                  <p className="text-sm text-red-500 mt-2">{commentError}</p>
                )}
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleCommentSubmit}
                    disabled={isCommentSubmitting}
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-60"
                  >
                    {isCommentSubmitting ? '등록 중...' : '댓글 등록'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
