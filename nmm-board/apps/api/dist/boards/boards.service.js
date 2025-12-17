"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardsService = void 0;
const common_1 = require("@nestjs/common");
const board_repository_1 = require("./board.repository");
const board_status_enum_1 = require("./board-status.enum");
const comment_repository_1 = require("./comment.repository");
let BoardsService = class BoardsService {
    boardRepository;
    commentRepository;
    constructor(boardRepository, commentRepository) {
        this.boardRepository = boardRepository;
        this.commentRepository = commentRepository;
    }
    async getAllBoards(user, options = {}) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 6;
        const skip = (page - 1) * limit;
        const [data, total] = await this.boardRepository.findAndCount({
            where: [
                { status: board_status_enum_1.BoardStatus.PUBLIC },
                { user: { id: user.id } },
            ],
            relations: ['user'],
            take: limit,
            skip,
            order: { id: 'DESC' },
        });
        return { data, total };
    }
    createBoard(createBoardDto, user) {
        return this.boardRepository.createBoard(createBoardDto, user);
    }
    async getBoardById(id, user) {
        const found = await this.boardRepository.findOne({
            where: { id },
            relations: ['user', 'comments', 'comments.user'],
            order: {
                comments: {
                    createdAt: 'ASC',
                },
            },
        });
        if (!found) {
            throw new common_1.NotFoundException(`Board with ID ${id} not found`);
        }
        if (found.status === board_status_enum_1.BoardStatus.PRIVATE && found.user?.id !== user.id) {
            throw new common_1.ForbiddenException('Private board access is restricted');
        }
        return found;
    }
    async deleteBoard(id, user) {
        const result = await this.boardRepository.delete({ id, user });
        console.log(result);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Board with ID ${id} not found`);
        }
    }
    async updateBoardStatus(id, status, user) {
        const board = await this.getBoardById(id, user);
        if (board.user?.id !== user.id) {
            throw new common_1.ForbiddenException('You can only update your own boards');
        }
        board.status = status;
        await this.boardRepository.save(board);
        return board;
    }
    async addComment(boardId, createCommentDto, user) {
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
        });
    }
};
exports.BoardsService = BoardsService;
exports.BoardsService = BoardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [board_repository_1.BoardRepository,
        comment_repository_1.CommentRepository])
], BoardsService);
//# sourceMappingURL=boards.service.js.map