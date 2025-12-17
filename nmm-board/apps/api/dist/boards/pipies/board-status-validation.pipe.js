"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardStatusValidationPipe = void 0;
const board_status_enum_1 = require("../board-status.enum");
class BoardStatusValidationPipe {
    StatusOptions = [board_status_enum_1.BoardStatus.PUBLIC, board_status_enum_1.BoardStatus.PRIVATE];
    transform(value, metadata) {
        value = value.toUpperCase();
        if (!this.isStatusValid(value)) {
            throw new Error(`"${value}" is an invalid status`);
        }
        return value;
    }
    isStatusValid(status) {
        const idx = this.StatusOptions.indexOf(status);
        return idx !== -1;
    }
}
exports.BoardStatusValidationPipe = BoardStatusValidationPipe;
//# sourceMappingURL=board-status-validation.pipe.js.map