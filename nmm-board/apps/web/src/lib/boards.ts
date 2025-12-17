import api from './api';
import type { Board, CreateBoardDto, BoardStatus, Comment, PaginatedBoards } from '@nmm-board/shared';

export const boardService = {
  // 모든 게시글 조회
  async getAllBoards(page = 1, limit = 6): Promise<PaginatedBoards> {
    const response = await api.get<PaginatedBoards>('/boards', {
      params: { page, limit },
    });
    return response.data;
  },

  // 게시글 생성
  async createBoard(data: CreateBoardDto): Promise<Board> {
    const response = await api.post<Board>('/boards', data);
    return response.data;
  },

  // 게시글 상세 조회
  async getBoardById(id: number): Promise<Board> {
    const response = await api.get<Board>(`/boards/${id}`);
    return response.data;
  },

  // 게시글 삭제
  async deleteBoard(id: number): Promise<void> {
    await api.delete(`/boards/${id}`);
  },

  // 게시글 상태 변경
  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const response = await api.patch<Board>(`/boards/${id}/status`, { status });
    return response.data;
  },

  // 댓글 생성
  async createComment(boardId: number, content: string): Promise<Comment> {
    const response = await api.post<Comment>(`/boards/${boardId}/comments`, { content });
    return response.data;
  },
};

export default boardService;
