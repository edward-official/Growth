import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import type { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipies/board-status-validation.pipe';
import { Board } from './board.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  private logger = new Logger('BoardsController');
  constructor(private boardsService: BoardsService) {}

  // @Get()
  // getAllBoards(): Board[] {
  //   return this.boardsService.getAllBoards();
  // }
  @Get()
  getAllBoards(
    @GetUser() user: User,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 6,
  ) {
    return this.boardsService.getAllBoards(user, { page, limit });
  }

  // @Post()
  // @UsePipes(ValidationPipe)
  // createBoard(@Body() createBoardDto: CreateBoardDto): Board {
  //   return this.boardsService.createBoard(createBoardDto);
  // }
  @Post()
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User
  ): Promise<Board> {
    this.logger.verbose(`User "${user.username}" creating a new board. Data: ${JSON.stringify(createBoardDto)}`);
    return this.boardsService.createBoard(createBoardDto, user);
  }

  // @Get('/:id')
  // getBoardById(@Param("id") id: string): Board {
  //   return this.boardsService.getBoardById(id);
  // }
  @Get('/:id')
  getBoardById(
    @Param("id", ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardsService.getBoardById(id, user);
  }

  // @Delete('/:id')
  // deleteBoard(@Param("id") id: string): void {
  //   this.boardsService.deleteBoard(id);
  // }
  @Delete('/:id')
  deleteBoard(
    @Param("id", ParseIntPipe) id: number,
    @GetUser() user: User
  ): Promise<void> {
    return this.boardsService.deleteBoard(id, user);
  }

  @Patch('/:id/status')
  updateBoardStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status", BoardStatusValidationPipe) status: BoardStatus,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardsService.updateBoardStatus(id, status, user);
  }

  @Post('/:id/comments')
  @UsePipes(ValidationPipe)
  addComment(
    @Param("id", ParseIntPipe) id: number,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ): Promise<Comment> {
    return this.boardsService.addComment(id, createCommentDto, user);
  }
}
