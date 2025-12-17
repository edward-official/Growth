import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Board } from "./board.entity";
import { User } from "src/auth/user.entity";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Board, (board) => board.comments, { onDelete: 'CASCADE' })
  board: Board;

  @ManyToOne(() => User, (user) => user.comments, { eager: false, onDelete: 'CASCADE' })
  user: User;
}
