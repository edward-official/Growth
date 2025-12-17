'use client';

import Link from 'next/link';
import type { Board } from '@nmm-board/shared';
import { BoardStatus } from '@nmm-board/shared';

interface BoardCardProps {
  board: Board;
}

export default function BoardCard({ board }: BoardCardProps) {
  const isPublic = board.status === BoardStatus.PUBLIC;

  return (
    <Link href={`/boards/${board.id}`}>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer border-2 border-transparent hover:border-gray-300 transform hover:-translate-y-1">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
            {board.title}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isPublic
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {board.status}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {board.description}
        </p>

        {board.user && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium">작성자:</span>
            <span>{board.user.username}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
