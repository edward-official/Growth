import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './board-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardRepository extends Repository<Board> {
  constructor(private readonly dataSource: DataSource) {
    super(Board, dataSource.createEntityManager());
  }

  async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    const { title, description, status } = createBoardDto;

    const board = this.create({
      title,
      description,
      status: status || BoardStatus.PUBLIC, // DTO의 status 사용, 없으면 기본값 PUBLIC
      user,
    });

    await this.save(board);
    return board;
  }
}
