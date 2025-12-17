'use client';

import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import boardService from '@/lib/boards';
import type { CreateBoardDto } from '@nmm-board/shared';
import { BoardStatus } from '@nmm-board/shared';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBoardModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateBoardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<BoardStatus>(BoardStatus.PUBLIC);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('제목과 설명을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const data: CreateBoardDto = {
        title: title.trim(),
        description: description.trim(),
        status: status, // 선택한 status 추가
      };
      await boardService.createBoard(data);
      setTitle('');
      setDescription('');
      setStatus(BoardStatus.PUBLIC); // 기본값으로 리셋
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || '게시글 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">새 게시글 작성</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              placeholder="게시글 제목을 입력하세요"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
              placeholder="게시글 내용을 입력하세요"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              공개 설정
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={BoardStatus.PUBLIC}
                  checked={status === BoardStatus.PUBLIC}
                  onChange={(e) => setStatus(e.target.value as BoardStatus)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                  disabled={isLoading}
                />
                <span className="text-sm font-medium text-gray-700">
                  PUBLIC <span className="text-gray-500 text-xs">(모두에게 공개)</span>
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={BoardStatus.PRIVATE}
                  checked={status === BoardStatus.PRIVATE}
                  onChange={(e) => setStatus(e.target.value as BoardStatus)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                  disabled={isLoading}
                />
                <span className="text-sm font-medium text-gray-700">
                  PRIVATE <span className="text-gray-500 text-xs">(나만 보기)</span>
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:opacity-90 transition font-medium disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? '생성 중...' : '생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
