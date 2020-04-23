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
class tourModel {
    constructor() {
        this.response = {};
    }
    getTourList(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let req_data = request.body;
            let draw = req_data.draw;
            let length = req_data.length;
            let order = req_data.order;
            let search = req_data.search;
            let start = req_data.start;
            let recordsTotal = 0;
            let filterValue = '';
            if (search) {
                filterValue = search.value;
            }
            let orderby = "";
            if (order && order.length > 0) {
                let column = order[0].column;
                let dir = order[0].dir;
                if (column == 0) {
                    orderby = " tour_id ";
                }
                else if (column == 1) {
                    orderby = " description ";
                }
                else if (column == 2) {
                    orderby = " customer ";
                }
                else if (column == 3) {
                    orderby = " client_award ";
                }
                else if (column == 4) {
                    orderby = " price_basis ";
                }
                orderby += dir;
            }
            else {
                orderby = " created_time DESC ";
            }
            orderby = "  ORDER BY " + orderby + " ";
            let limit = " LIMIT  " + start + " , " + length + " ";
            let cond = "";
            if (filterValue && filterValue !== undefined) {
                filterValue = filterValue.toLowerCase();
                cond = ` AND ( LOWER(tour_id) LIKE '%${filterValue}%' OR LOWER(surname) LIKE '%${filterValue}%' OR LOWER(description) LIKE '%${filterValue}%' OR LOWER(customer) LIKE '%${filterValue}%' OR LOWER(client_award) LIKE '%${filterValue}%' OR LOWER(price_basis) LIKE '%${filterValue}%' OR LOWER(tour_type) LIKE '%${filterValue}%' OR LOWER(service_power_partners) LIKE '%${filterValue}%'  ) `;
            }
            const tourcountQry = "SELECT count(*) AS total_count FROM tours WHERE status = 1 " + cond;
            const totalLenResp = yield db_1.db.selectRow(tourcountQry);
            recordsTotal = totalLenResp.total_count;
            const tourQry = "SELECT * FROM tours WHERE status = 1 " + cond + orderby + limit;
            const tourResult = yield db_1.db.select(tourQry);
            this.response.status = 'ok';
            this.response.draw = draw;
            this.response.recordsTotal = recordsTotal;
            this.response.recordsFiltered = recordsTotal;
            this.response.data = tourResult;
            return this.response;
        });
    }
    addedit(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = req.body;
            let toursId = formData.toursId;
            toursId = (toursId > 0) ? toursId : 0;
            if (toursId > 0) {
                return yield this.editInformation(toursId, formData);
            }
            else {
                return yield this.addInformation(formData);
            }
        });
    }
    addInformation(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            let now = new Date();
            let current_time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
            const insertQry = `INSERT INTO tours SET ?`;
            const insertData = { tour_no: formData.tour_no, surname: formData.surname, description: formData.description, customer: formData.customer, client_award: formData.client_award, price_basis: formData.price_basis, day: formData.day, valid_from: formData.valid_from, date_of_expiry: formData.date_of_expiry, tour_type: formData.tour_type, service_power_partners: formData.service_power_partners, service_valid_from: formData.service_valid_from, service_date_of_expiry: formData.service_date_of_expiry, service_ltp_prize_week: formData.service_ltp_prize_week, service_ltp_prize_we: formData.service_ltp_prize_we, comment: formData.comment, created_time: current_time, updated_time: current_time };
            yield db_1.db.insert(insertQry, insertData);
            this.response.status = 'ok';
            this.response.message = 'Person has been inserted successfully.';
            return this.response;
        });
    }
    editInformation(toursId, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            let now = new Date();
            let current_time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
            const insertQry = `UPDATE tours SET ? WHERE toursId = ${toursId}`;
            const insertData = { tour_no: formData.tour_no, surname: formData.surname, description: formData.description, customer: formData.customer, client_award: formData.client_award, price_basis: formData.price_basis, day: formData.day, valid_from: formData.valid_from, date_of_expiry: formData.date_of_expiry, tour_type: formData.tour_type, service_power_partners: formData.service_power_partners, service_valid_from: formData.service_valid_from, service_date_of_expiry: formData.service_date_of_expiry, service_ltp_prize_week: formData.service_ltp_prize_week, service_ltp_prize_we: formData.service_ltp_prize_we, comment: formData.comment, updated_time: current_time };
            yield db_1.db.update(insertQry, insertData);
            this.response.status = 'ok';
            this.response.message = 'Person has been updated successfully.';
            return this.response;
        });
    }
    getTourDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let resultData = {};
            let toursId = parseInt(data.toursId);
            const tourQry = "SELECT * FROM tours WHERE status = ? AND toursId = ? ";
            const tourResult = yield db_1.db.selectRow(tourQry, [1, toursId]);
            this.response.status = 'ok';
            this.response.data = tourResult;
            return this.response;
        });
    }
    deleteTour(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultData = {};
            let toursId = parseInt(data.toursId);
            const deleteTourQry = ` DELETE FROM tours WHERE toursId = ${toursId} `;
            yield db_1.db.delete(deleteTourQry);
            this.response.status = 'ok';
            this.response.message = 'Article Has been deleted successfully.';
            return this.response;
        });
    }
    getNewToursNo() {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let newtoursId = 0;
            const toursQry = "SELECT toursId FROM tours WHERE status = ? ORDER BY  toursId DESC LIMIT 1  ";
            const toursResult = yield db_1.db.selectRow(toursQry, [1]);
            if (toursResult && toursResult.toursId > 0) {
                newtoursId = parseInt(toursResult.toursId);
            }
            newtoursId = newtoursId + 1;
            this.response.status = 'ok';
            this.response.newtoursId = newtoursId;
            return this.response;
        });
    }
}
exports.tourModelObj = new tourModel();
