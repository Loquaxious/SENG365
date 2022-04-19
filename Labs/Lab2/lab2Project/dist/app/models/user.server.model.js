"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.alter = exports.insert = exports.getOne = exports.getAll = void 0;
const db_1 = require("../../config/db");
const logger_1 = __importDefault(require("../../config/logger"));
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info("Getting all the users from the database");
    const conn = yield (0, db_1.getPool)().getConnection();
    const query = "select * from lab2_users";
    const [rows] = yield conn.query(query);
    conn.release();
    return rows;
});
exports.getAll = getAll;
const getOne = (id) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Getting user ${id} from the database`);
    const conn = yield (0, db_1.getPool)().getConnection();
    const query = 'select * from lab2_users where user_id = ?';
    const [rows] = yield conn.query(query, [id]);
    conn.release();
    return rows;
});
exports.getOne = getOne;
const insert = (username) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Adding user ${username} to the database`);
    const conn = yield (0, db_1.getPool)().getConnection();
    const query = 'insert into lab2_users (username) values ( ? )';
    const [result] = yield conn.query(query, [username]);
    conn.release();
    return result;
});
exports.insert = insert;
const alter = (id, username) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Updating user id: ${id} username to ${username}`);
    const conn = yield (0, db_1.getPool)().getConnection();
    const query = 'update lab2_users set username = ? where user_id = ?';
    const result = yield conn.query(query, [username, id]);
    conn.release();
    return result;
});
exports.alter = alter;
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Removing user id: ${id} from the database`);
    const conn = yield (0, db_1.getPool)().getConnection();
    const query = 'delete from lab2_users where user_id = ?';
    const [result] = yield conn.query(query, [id]);
    conn.release();
    return result;
});
exports.remove = remove;
//# sourceMappingURL=user.server.model.js.map