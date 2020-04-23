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
const dateFormat = require("dateformat");
class historyModel {
    constructor() {
        this.response = {};
    }
    getHistoryList(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let req_data = request.body;
            let draw = req_data.draw;
            let length = req_data.length;
            let order = req_data.order;
            let search = req_data.search;
            let start = req_data.start;
            let menuItem = req_data.menuItem;
            let menuId = req_data.menuId;
            let recordsTotal = 0;
            let filterValue = "";
            let cond = "";
            let orderby = "";
            if (search) {
                filterValue = search.value;
            }
            if (order && order.length > 0) {
                let column = order[0].column;
                let dir = order[0].dir;
                switch (column) {
                    case 0:
                        orderby = " logId ";
                        break;
                    case 1:
                        orderby = " user_name ";
                        break;
                    case 2:
                        orderby = " description ";
                        break;
                    case 3:
                        orderby = " log_time ";
                        break;
                }
                orderby += dir;
            }
            else {
                orderby = " h.log_time DESC ";
            }
            orderby = "  ORDER BY " + orderby + " ";
            let limit = " LIMIT  " + start + " , " + length + " ";
            cond = ` where h.menuItem = '${menuItem}' `;
            if (menuId)
                cond += ` AND h.menuId = '${menuId}'`;
            if (filterValue && filterValue !== undefined) {
                filterValue = filterValue.toLowerCase();
                cond =
                    cond +
                        ` AND ( LOWER(logId) LIKE '%${filterValue}%' OR LOWER(description) LIKE '%${filterValue}%' OR LOWER(user_name) LIKE '%${filterValue}%' OR LOWER(log_time) LIKE '%${filterValue}%'  ) `;
            }
            const query_historynumber = "SELECT count(*) as total_count FROM history_log AS h left join users AS u on h.userId = u.userId" +
                cond +
                orderby;
            const totalLenResp = yield db_1.db.selectRow(query_historynumber);
            recordsTotal = totalLenResp.total_count;
            const query_history = "SELECT u.user_name as username, h.description as description, h.logId as historyno, h.log_time as datetime FROM history_log AS h left join users AS u on h.userId = u.userId" +
                cond +
                orderby +
                limit;
            const history_result = yield db_1.db.select(query_history);
            this.response = {};
            this.response.status = "ok";
            this.response.draw = draw;
            this.response.recordsTotal = recordsTotal;
            this.response.recordsFiltered = recordsTotal;
            this.response.data = history_result;
            return this.response;
        });
    }
}
exports.historyModelObj = new historyModel();
