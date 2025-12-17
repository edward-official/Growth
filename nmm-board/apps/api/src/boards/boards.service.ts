import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { BoardStatus } from './board-status.enum';
import { User } from 'src/auth/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';
import { CommentRepository } from './comment.repository';

@Injectable()
export class BoardsService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  // getAllBoards(): Board[] {
  //   return this.boards;
  // }
  async getAllBoards(
    user: User,
    options: { page?: number; limit?: number } = {},
  ): Promise<{ data: Board[]; total: number }> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 6;
    const skip = (page - 1) * limit;

    const [data, total] = await this.boardRepository.findAndCount({
      where: [
        { status: BoardStatus.PUBLIC },
        { user: { id: user.id } }, // include the current user's private boards
      ],
      relations: ['user'], // user 정보 포함
      take: limit,
      skip,
      order: { id: 'DESC' },
    });

    return { data, total };
  }

  // createBoard(createBoardDto: CreateBoardDto): Board {
  //   const { title, description } = createBoardDto;

  //   const board: Board = {
  //     id: uuid(),
  //     title,  
  //     description,
  //     status: BoardStatus.PUBLIC,
  //   };
  //   this.boards.push(board);
  //   return board;
  // }
  createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto, user);
  }

  // getBoardById(id: string): Board {
  //   const found = this.boards.find((board) => board.id === id);
  //   if (!found) {
  //     throw new NotFoundException(`Board with ID ${id} not found`);
  //   }
  //   return found;
  // }
  async getBoardById(id: number, user: User): Promise<Board> {
    const found = await this.boardRepository.findOne({
      where: { id },
      relations: ['user', 'comments', 'comments.user'], // user 정보 포함
      order: {
        comments: {
          createdAt: 'ASC',
        },
      },
    });
    if (!found) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
    if (found.status === BoardStatus.PRIVATE && found.user?.id !== user.id) {
      throw new ForbiddenException('Private board access is restricted');
    }
    return found;
  }

  // deleteBoard(id: string): void {
  //   const found = this.getBoardById(id);
  //   this.boards = this.boards.filter((board) => board.id !== found.id);
  // }
  async deleteBoard(id: number, user: User): Promise<void> {
    const result = await this.boardRepository.delete({id, user});
    console.log(result);
    if (result.affected === 0) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
  }

  // updateBoardStatus(id: string, status: BoardStatus): Board {
  //   const board = this.getBoardById(id);
  //   board.status = status;
  //   return board;
  // }
  async updateBoardStatus(id: number, status: BoardStatus, user: User): Promise<Board> {
    const board = await this.getBoardById(id, user);
    if (board.user?.id !== user.id) {
      throw new ForbiddenException('You can only update your own boards');
    }
    board.status = status;
    await this.boardRepository.save(board);
    return board;
  }

  async addComment(boardId: number, createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
    const board = await this.getBoardById(boardId, user);
    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      board,
      user,
    });
    await this.commentRepository.save(comment);
    return this.commentRepository.findOne({
      where: { id: comment.id },
      relations: ['user'],
    }) as Promise<Comment>;
  }
}
