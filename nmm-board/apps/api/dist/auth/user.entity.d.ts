import { Board } from "src/boards/board.entity";
import { Comment } from "src/boards/comment.entity";
import { BaseEntity } from "typeorm";
export declare class User extends BaseEntity {
    id: number;
    username: string;
    password: string;
    boards: Board[];
    comments: Comment[];
    validatePassword(password: string): Promise<boolean>;
}
