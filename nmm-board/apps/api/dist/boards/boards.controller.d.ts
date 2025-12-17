import { BoardsService } from './boards.service';
import type { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';
export declare class BoardsController {
    private boardsService;
    private logger;
    constructor(boardsService: BoardsService);
    getAllBoards(user: User, page?: number, limit?: number): Promise<{
        data: Board[];
        total: number;
    }>;
    createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board>;
    getBoardById(id: number, user: User): Promise<Board>;
    deleteBoard(id: number, user: User): Promise<void>;
    updateBoardStatus(id: number, status: BoardStatus, user: User): Promise<Board>;
    addComment(id: number, createCommentDto: CreateCommentDto, user: User): Promise<Comment>;
}
