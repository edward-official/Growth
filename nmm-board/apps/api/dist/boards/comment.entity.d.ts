import { BaseEntity } from "typeorm";
import { Board } from "./board.entity";
import { User } from "src/auth/user.entity";
export declare class Comment extends BaseEntity {
    id: number;
    content: string;
    createdAt: Date;
    board: Board;
    user: User;
}
