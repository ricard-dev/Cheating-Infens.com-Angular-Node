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
class bankModel {
    addBank(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `INSERT INTO banks SET ?`;
            const feed = {
                bank_number: data.bank_number,
                account_number: data.account_number,
                name: data.name,
                bank_code: data.bank_code,
                iban: data.iban,
                bic: data.bic,
                companyId: data.companyId
            };
            const Resp = yield db_1.db.insert(sql, feed);
            const bankId = Resp.insertId;
            return {
                bankId,
                status: "ok",
                message: "Bank has been inserted"
            };
        });
    }
    getBanks(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let req_data = request.body;
            let draw = req_data.draw;
            let length = req_data.length;
            let order = req_data.order;
            let search = req_data.search;
            let start = req_data.start;
            let status = req_data.status;
            let columns = req_data.columns;
            let recordsTotal = 0;
            let filterValue = "";
            let orderIdsExist = [];
            let cond = "";
            if (status == undefined)
                status = 1;
            if (search) {
                filterValue = search.value;
            }
            let orderby = "";
            if (order && order.length > 0 && order[0].column < 4) {
                let column = order[0].column;
                let dir = order[0].dir;
                orderby = ` ${columns[column].name} ${dir}`;
            }
            else {
                orderby = " created_time DESC ";
            }
            orderby = "  ORDER BY " + orderby + " ";
            if (!length)
                length = 234242134234;
            let limit = ` LIMIT ${length} `;
            if (start != undefined) {
                limit += ` OFFSET ${start}`;
            }
            if (filterValue && filterValue !== undefined && filterValue != "") {
                filterValue = filterValue.toLowerCase();
                cond += " AND ( ";
                let flag = 0;
                if (columns) {
                    columns.forEach((item, index) => {
                        if (item.name != "") {
                            if (flag)
                                cond += ` OR LOWER(${item.name}) LIKE '%${filterValue}%' `;
                            else
                                cond += ` LOWER(${item.name}) LIKE '%${filterValue}%' `;
                            flag = 1;
                        }
                    });
                }
                if (flag)
                    cond += ") ";
                else
                    cond = "";
            }
            if (columns) {
                columns.forEach((item, index) => {
                    if (item.name != "" && item.search.value != "") {
                        cond += ` AND LOWER(${item.name}) LIKE '%${item.search.value}%' `;
                    }
                });
            }
            const qry = `SELECT banks.*, company.code as company_code
                  FROM banks
                  LEFT JOIN company ON company.companyId = banks.companyId
                  WHERE 1 = 1 ${cond} ${orderby} ${limit}`;
            let qryResult;
            try {
                qryResult = yield db_1.db.select(qry);
            }
            catch (e) {
                qryResult = [];
            }
            return {
                status: "ok",
                draw,
                recordsTotal: qryResult.length,
                recordsFiltered: qryResult.length,
                data: qryResult
            };
        });
    }
    getCompanyBanks(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let req_data = request.body;
            let companyId = req_data.companyId;
            let draw = req_data.draw;
            let length = req_data.length;
            let order = req_data.order;
            let search = req_data.search;
            let start = req_data.start;
            let status = req_data.status;
            let columns = req_data.columns;
            let recordsTotal = 0;
            let filterValue = "";
            let orderIdsExist = [];
            let cond = "";
            if (status == undefined)
                status = 1;
            if (search) {
                filterValue = search.value;
            }
            let orderby = "";
            if (order && order.length > 0 && order[0].column < 4) {
                let column = order[0].column;
                let dir = order[0].dir;
                orderby = ` ${columns[column].name} ${dir}`;
            }
            else {
                orderby = " created_time DESC ";
            }
            orderby = "  ORDER BY " + orderby + " ";
            if (!length)
                length = 234242134234;
            let limit = ` LIMIT ${length} `;
            if (start != undefined) {
                limit += ` OFFSET ${start}`;
            }
            if (filterValue && filterValue !== undefined && filterValue != "") {
                filterValue = filterValue.toLowerCase();
                cond += " AND ( ";
                let flag = 0;
                if (columns) {
                    columns.forEach((item, index) => {
                        if (item.name != "") {
                            if (flag)
                                cond += ` OR LOWER(${item.name}) LIKE '%${filterValue}%' `;
                            else
                                cond += ` LOWER(${item.name}) LIKE '%${filterValue}%' `;
                            flag = 1;
                        }
                    });
                }
                if (flag)
                    cond += ") ";
                else
                    cond = "";
            }
            if (columns) {
                columns.forEach((item, index) => {
                    if (item.name != "" && item.search.value != "") {
                        cond += ` AND LOWER(${item.name}) LIKE '%${item.search.value}%' `;
                    }
                });
            }
            let qry = "";
            if (companyId) {
                qry = `SELECT banks.*, company.code as company_code
              FROM (SELECT * FROM banks WHERE companyId = ${companyId}) banks
              LEFT JOIN company ON company.companyId = banks.companyId
              WHERE 1 = 1 ${cond} ${orderby} ${limit}`;
            }
            else {
                qry = `SELECT banks.*, company.code as company_code
              FROM banks
              LEFT JOIN company ON company.companyId = banks.companyId
              WHERE 1 = 1 ${cond} ${orderby} ${limit}`;
            }
            let qryResult;
            try {
                qryResult = yield db_1.db.select(qry);
            }
            catch (e) {
                qryResult = [];
            }
            return {
                status: "ok",
                draw,
                recordsTotal: qryResult.length,
                recordsFiltered: qryResult.length,
                data: qryResult
            };
        });
    }
    updateBank(bankId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE banks SET ? WHERE bankId = ${bankId}`;
            const feed = {
                bank_number: data.bank_number,
                account_number: data.account_number,
                name: data.name,
                bank_code: data.bank_code,
                iban: data.iban,
                bic: data.bic,
                companyId: data.companyId
            };
            const result = yield db_1.db.update(sql, feed);
            return result;
        });
    }
    deleteBank(bankId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `DELETE FROM banks WHERE bankId = ${bankId}`;
            const result = yield db_1.db.delete(sql);
            return {
                affectedRows: result.affectedRows
            };
        });
    }
    getBank(bankId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM banks WHERE bankId = ${bankId}`;
            const result = yield db_1.db.selectRow(sql);
            return result;
        });
    }
    getNewBankId() {
        return __awaiter(this, void 0, void 0, function* () {
            let newBankId = 0;
            const qry = "SELECT bankId FROM banks ORDER BY  bankId DESC LIMIT 1  ";
            const result = yield db_1.db.selectRow(qry);
            if (result && result.bankId > 0) {
                newBankId = parseInt(result.bankId);
            }
            newBankId = newBankId + 1;
            return {
                status: "ok",
                newBankId
            };
        });
    }
}
exports.bankModelObj = new bankModel();
