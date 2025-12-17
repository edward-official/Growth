import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BoardStatus } from "./board-status.enum";
import { User } from "src/auth/user.entity";
import { Comment } from "./comment.entity";

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: BoardStatus;

  @ManyToOne(type => User, user => user.boards, { eager: false })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.board, { eager: false })
  comments: Comment[];
}
