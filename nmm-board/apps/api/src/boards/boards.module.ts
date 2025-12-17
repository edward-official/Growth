import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { AuthModule } from 'src/auth/auth.module';
import { Comment } from './comment.entity';
import { CommentRepository } from './comment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, Comment]), // TypeOrm이 Board라는 엔티티를 이용해서 Repository를 생성해줄 수 있도록 설정
    AuthModule,
  ],
  controllers: [BoardsController],
  providers: [BoardsService, BoardRepository, CommentRepository]
})
export class BoardsModule {}
