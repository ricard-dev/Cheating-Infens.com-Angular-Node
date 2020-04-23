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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../utils/db");
const dateFormat = require('dateformat');
class historyService {
    logHistory(user, description, menuItem, menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQry = `INSERT INTO history_log SET ?`;
            let insertData = {
                description,
                menuId,
                menuItem,
                userId: user.userId,
                user_name: user.user_name,
            };
            const result = yield db_1.db.insert(insertQry, insertData);
        });
    }
}
exports.historyServiceObj = new historyService();
