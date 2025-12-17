"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const config_1 = __importDefault(require("config"));
const dbConfig = config_1.default.get('db');
exports.typeOrmConfig = {
    ...dbConfig,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
};
//# sourceMappingURL=typeorm.config.js.map