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
const historyService_1 = require("../services/historyService");
const dateFormat = require("dateformat");
class personModel {
    constructor() {
        this.response = {};
    }
    getPersonList(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let req_data = request.body;
            let draw = req_data.draw;
            let length = req_data.length;
            let order = req_data.order;
            let search = req_data.search;
            let start = req_data.start;
            let columns = req_data.columns;
            let global = req_data.global;
            let recordsTotal = 0;
            let filterValue = "";
            let personIdsExist = [];
            if (search) {
                filterValue = search.value;
                personIdsExist =
                    search.pIdsExist &&
                        search.pIdsExist !== undefined &&
                        search.pIdsExist.length > 0
                        ? search.pIdsExist
                        : [];
            }
            let cond = "";
            let orderby = "";
            if (personIdsExist && personIdsExist.length > 0) {
                let pidsexist = personIdsExist.join();
                cond += ` AND personId NOT IN (${pidsexist}) `;
            }
            if (order && order.length > 0) {
                let column = order[0].column;
                let dir = order[0].dir;
                if (column == 0) {
                    orderby = " person_number ";
                }
                else if (column == 1) {
                    orderby = " salutation ";
                }
                else if (column == 2) {
                    orderby = " first_name ";
                }
                else if (column == 3) {
                    orderby = " surname ";
                }
                else if (column == 4) {
                    orderby = " phone ";
                }
                else if (column == 5) {
                    orderby = " email ";
                }
                orderby += dir;
            }
            else {
                orderby = " created_time DESC ";
            }
            orderby = "  ORDER BY " + orderby + " ";
            if (!length)
                length = 234242134234;
            let limit = ` LIMIT ${length} `;
            start && (limit += ` OFFSET ${start}`);
            if (filterValue && filterValue !== undefined) {
                filterValue = filterValue.toLowerCase();
                cond += ` AND ( LOWER(person_number) LIKE '%${filterValue}%' OR LOWER(salutation) LIKE '%${filterValue}%' OR LOWER(first_name) LIKE '%${filterValue}%' OR LOWER(surname) LIKE '%${filterValue}%' OR LOWER(phone) LIKE '%${filterValue}%'  OR LOWER(email) LIKE '%${filterValue}%'   ) `;
            }
            columns.forEach((item, index) => {
                if (item.name != "" && item.search.value != "") {
                    cond += `  AND ( LOWER(${item.name}) LIKE '%${item.search.value}%' `;
                }
            });
            const personcountQry = "SELECT count(*) AS total_count FROM persons WHERE status = 1 " + cond;
            const totalLenResp = yield db_1.db.selectRow(personcountQry);
            recordsTotal = totalLenResp.total_count;
            let select = "";
            if (columns && global != undefined && global == false) {
                columns.forEach((item, index) => {
                    if (index > 0)
                        select += `,${item.name}`;
                    else
                        select += `${item.name}`;
                });
            }
            if (select == "")
                select = "*";
            const personQry = "SELECT * FROM persons WHERE status = 1 " + cond + orderby + limit;
            const personResult = yield db_1.db.select(personQry);
            this.response.status = "ok";
            this.response.draw = draw;
            this.response.recordsTotal = recordsTotal;
            this.response.recordsFiltered = recordsTotal;
            this.response.data = personResult;
            return this.response;
        });
    }
    addedit(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = req.body;
            const basicData = JSON.parse(formData.basicData);
            let personsId = basicData.personId;
            personsId = personsId > 0 ? personsId : 0;
            let result;
            if (personsId > 0) {
                result = yield this.editInformation(personsId, formData);
                yield historyService_1.historyServiceObj.logHistory(req.user, `edited the client ${personsId}`, "person", personsId);
            }
            else {
                result = yield this.addInformation(formData);
                yield historyService_1.historyServiceObj.logHistory(req.user, `created the client ${result.newPersonId}`, "person", result.newPersonId);
            }
        });
    }
    addInformation(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.response = {};
                let now = new Date();
                let current_time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                const insertQry = `INSERT INTO persons SET ?`;
                let status = formData.status !== undefined ? formData.status : 1;
                console.log(formData);
                const insertData = {
                    person_number: formData.person_number,
                    salutation: formData.salutation,
                    first_name: formData.first_name,
                    surname: formData.surname,
                    position: formData.position,
                    department: formData.department,
                    phone: formData.phone,
                    mobile_number: formData.mobile_number,
                    fax: formData.fax,
                    type: formData.type,
                    email: formData.email,
                    comment: formData.comment,
                    status: 1,
                    created_time: current_time,
                    updated_time: current_time
                };
                const personInsResp = yield db_1.db.insert(insertQry, insertData);
                const personId = personInsResp.insertId;
                this.response.status = "ok";
                this.response.message = "Person has been inserted successfully.";
                this.response.newPersonId = personId;
                return this.response;
            }
            catch (e) {
                console.log(e);
                return {
                    status: "error",
                    message: e.message
                };
            }
        });
    }
    editInformation(personsId, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let now = new Date();
                let current_time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                const insertQry = `UPDATE persons SET ? WHERE personId = ${personsId}`;
                const basicData = JSON.parse(formData.basicData);
                const insertData = {
                    person_number: basicData.person_number,
                    salutation: basicData.salutation,
                    first_name: basicData.first_name,
                    surname: basicData.surname,
                    position: basicData.position,
                    department: basicData.department,
                    phone: basicData.phone,
                    mobile_number: basicData.mobile_number,
                    fax: basicData.fax,
                    email: basicData.email,
                    type: basicData.type,
                    comment: basicData.comment,
                    updated_time: current_time
                };
                yield db_1.db.update(insertQry, insertData);
                this.response.status = "ok";
                this.response.message = "Person has been updated successfully.";
                return this.response;
            }
            catch (e) {
                console.log(e);
                return {
                    status: "error",
                    message: e.message
                };
            }
        });
    }
    getPersonDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultData = {};
            let personsId = parseInt(data.personId);
            const personQry = "SELECT * FROM persons WHERE status = ? AND personId = ? ";
            const personResult = yield db_1.db.selectRow(personQry, [1, personsId]);
            resultData.basicData = personResult;
            this.response.status = "ok";
            this.response.data = resultData;
            return this.response;
        });
    }
    deletePerson(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultData = {};
            let personId = parseInt(data.personId);
            const deletePersonQry = ` DELETE FROM persons WHERE personId = ${personId} `;
            const result = yield db_1.db.delete(deletePersonQry);
            this.response.status = "ok";
            this.response.data = {
                affectedRows: result.affectedRows,
                message: "operation successfully completed"
            };
            return this.response;
        });
    }
    getNewPersonsNo() {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let newpersonsId = 0;
            const personsQry = "SELECT personId FROM persons WHERE 1=1 ORDER BY  personId DESC LIMIT 1  ";
            const personsResult = yield db_1.db.selectRow(personsQry);
            if (personsResult && personsResult.personId > 0) {
                newpersonsId = parseInt(personsResult.personId);
            }
            newpersonsId = newpersonsId + 1;
            this.response.status = "ok";
            this.response.newpersonsId = newpersonsId;
            return this.response;
        });
    }
    personOrderList(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let req_data = request.body;
            let fetchMethod = 0;
            if (request.query.type == "all") {
                fetchMethod = 2;
            }
            else if (request.query.type == "special") {
                fetchMethod = 1;
            }
            let draw = req_data.draw;
            let length = req_data.length;
            let order = req_data.order;
            let search = req_data.search;
            let start = req_data.start;
            let status = req_data.status;
            let columns = req_data.columns;
            let recordsTotal = 0;
            let filterValue = "";
            let personId = 0;
            let newOrderIds = [];
            let deletedOrderIds = [];
            if (search) {
                filterValue = search.value;
                personId = search.personId;
                newOrderIds = search.newOrderIds;
                deletedOrderIds = search.deletedOrderIds;
            }
            personId =
                personId && personId !== undefined && personId !== null && personId > 0
                    ? personId
                    : 0;
            let cond = " 1=1 ", firstCond = "";
            if (newOrderIds && newOrderIds.length > 0) {
                let newPIds = newOrderIds.join();
                if (personId > 0)
                    firstCond += ` AND ( (o.personId = ${personId} ) OR o.orderId IN(${newPIds}) )`;
                else
                    firstCond += ` AND ( o.orderId IN(${newPIds}))`;
            }
            else {
                firstCond += ` AND o.personId = ${personId}`;
            }
            if (deletedOrderIds && deletedOrderIds.length > 0) {
                let doIds = deletedOrderIds.join();
                firstCond += ` AND o.orderId NOT IN  ( ${doIds} )`;
            }
            if (status == 1)
                firstCond += " AND o.status = 1 ";
            if (status == 0)
                firstCond += " AND o.status = 0 ";
            let orderby = "";
            if (order && order.length > 0 && order[0].column < 4) {
                let column = order[0].column;
                let dir = order[0].dir;
                orderby = ` ${columns[column].name} ${dir}`;
            }
            else {
                orderby = " o.created_time DESC ";
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
                    cond = " 1 = 1 ";
            }
            if (columns) {
                columns.forEach((item, index) => {
                    if (item.name &&
                        item.name != "" &&
                        item.search &&
                        item.search.value &&
                        item.search.value != "") {
                        cond += ` AND LOWER(${item.name}) LIKE '%${item.search.value}%' `;
                    }
                });
            }
            if (fetchMethod == 0) {
                firstCond += ` AND o.special_type = false `;
            }
            else if (fetchMethod == 1) {
                firstCond += ` AND o.special_type = true `;
            }
            firstCond = ` 1=1 ` + firstCond;
            const ordersQry = `SELECT * FROM ( SELECT  o.orderId, o.order_number, o.description, o.client_price, o.client_price_week, o.client_price_weekend, o.contractor_price, o.contractor_price_week, o.contractor_price_weekend, o.special_type, o.status, o.created_time, o.updated_time, o.price_basis, o.day, c.clientId, c.client_number, c.name1 AS client_name, com.name1 AS company_name, c.city AS client_city,
                ctr.contractorId, ctr.contractor_number, ctr.name1 AS contractor_name, ctr.city AS contractor_city, o.manager, cam.name as manager_name
        FROM orders AS o
        LEFT JOIN clients_order AS co ON o.orderId = co.orderId
        LEFT JOIN clients AS c ON c.clientId =  co.clientId
        LEFT JOIN client_account_manager AS cam ON o.manager = cam.id  
        LEFT JOIN company AS com ON c.companyId = com.companyId
        LEFT JOIN contractors_order AS cto ON o.orderId = cto.orderId
        LEFT JOIN contractors AS ctr ON ctr.contractorId = cto.contractorId
        WHERE ${firstCond} ${orderby}, cam.order ) AS t1
      WHERE ` +
                cond +
                limit;
            const orderResult = yield db_1.db.select(ordersQry);
            this.response = {};
            this.response.status = "ok";
            this.response.draw = draw;
            this.response.recordsTotal = orderResult.length;
            this.response.recordsFiltered = orderResult.length;
            this.response.data = orderResult;
            return this.response;
        });
    }
}
exports.personModelObj = new personModel();
