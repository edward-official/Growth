/**
 * 공유 타입 정의
 * 프론트엔드와 백엔드에서 공통으로 사용할 타입들을 정의합니다.
 */

// Board Status Enum
export enum BoardStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

// User 타입
export interface User {
  id: number;
  username: string;
}

// Comment 타입
export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user?: User;
}

// Board 타입
export interface Board {
  id: number;
  title: string;
  description: string;
  status: BoardStatus;
  user?: User;
  comments?: Comment[];
}

// Pagination 결과 타입
export interface PaginatedBoards {
  data: Board[];
  total: number;
  page: number;
  limit: number;
}

// Auth 관련 타입
export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

// Board 생성 DTO
export interface CreateBoardDto {
  title: string;
  description: string;
  status?: BoardStatus;
}
