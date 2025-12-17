import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { BoardStatus } from './board-status.enum';
import { User } from 'src/auth/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';
import { CommentRepository } from './comment.repository';
export declare class BoardsService {
    private readonly boardRepository;
    private readonly commentRepository;
    constructor(boardRepository: BoardRepository, commentRepository: CommentRepository);
    getAllBoards(user: User, options?: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: Board[];
        total: number;
    }>;
    createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board>;
    getBoardById(id: number, user: User): Promise<Board>;
    deleteBoard(id: number, user: User): Promise<void>;
    updateBoardStatus(id: number, status: BoardStatus, user: User): Promise<Board>;
    addComment(boardId: number, createCommentDto: CreateCommentDto, user: User): Promise<Comment>;
}
