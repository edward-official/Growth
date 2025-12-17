import { BoardStatus } from "../board-status.enum";
export declare class CreateBoardDto {
    title: string;
    description: string;
    status?: BoardStatus;
}
