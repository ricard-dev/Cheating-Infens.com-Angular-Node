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
const historyService_1 = require("../services/historyService");
class orderModel {
    constructor() {
        this.response = {};
        this.user = {};
    }
    getOrderList(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let fetchMethod = 0;
            if (request.query.type == "all") {
                fetchMethod = 2;
            }
            else if (request.query.type == "special") {
                fetchMethod = 1;
            }
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
                orderIdsExist =
                    search.oIdsExist &&
                        search.oIdsExist !== undefined &&
                        search.oIdsExist.length > 0
                        ? search.oIdsExist
                        : [];
            }
            if (orderIdsExist && orderIdsExist.length > 0) {
                let oidsexist = orderIdsExist.join();
                cond += ` AND o.orderId NOT IN (${oidsexist}) `;
            }
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
                    cond = "";
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
            let firstCond = "";
            if (fetchMethod == 0) {
                firstCond += ` AND o.special_type = false `;
            }
            else if (fetchMethod == 1) {
                firstCond += ` AND o.special_type = true `;
            }
            firstCond = ` 1=1 AND o.status = ${status} ` + firstCond;
            const ordersQry = `SELECT * FROM (
        SELECT  o.orderId, o.order_number, o.description, o.client_price, o.client_price_week, o.client_price_weekend, o.contractor_price, o.contractor_price_week, o.contractor_price_weekend,
                o.special_type, o.status, o.created_time, o.updated_time, o.price_basis, o.day, c.clientId, c.client_number, c.name1 AS client_name, com.name1 AS company_name, c.city AS client_city,
                ctr.contractorId, ctr.contractor_number, ctr.name1 AS contractor_name, ctr.city AS contractor_city, o.manager, cam.id, cam.name as manager_name, cam.phone as manager_phone
        FROM orders AS o
        LEFT JOIN clients_order AS co ON o.orderId = co.orderId
        LEFT JOIN clients AS c ON c.clientId =  co.clientId
        LEFT JOIN client_account_manager AS cam ON o.manager = cam.id  
        LEFT JOIN company AS com ON c.companyId = com.companyId
        LEFT JOIN contractors_order AS cto ON o.orderId = cto.orderId
        LEFT JOIN contractors AS ctr ON ctr.contractorId =  cto.contractorId
        WHERE ${firstCond} ${orderby}, cam.order ) AS t1
      WHERE 1 = 1 ` +
                cond +
                limit;
            let ordersResult;
            try {
                ordersResult = yield db_1.db.select(ordersQry);
                const qry = "SELECT * FROM client_account_manager GROUP BY clientId ORDER BY `order`";
                let accountManagerResult = yield db_1.db.select(qry);
                let account_managers = [];
                let tmp = [], i = 0;
                for (i = 0; i < accountManagerResult.length; i++) {
                    if (i > 0 &&
                        accountManagerResult[i - 1].clientId !=
                            accountManagerResult[i].clientId) {
                        account_managers[accountManagerResult[i - 1].clientId] = tmp;
                        tmp = [];
                    }
                    tmp.push({
                        id: accountManagerResult[i].id,
                        clientId: accountManagerResult[i].clientId,
                        name: accountManagerResult[i].name,
                        phone: accountManagerResult[i].phone
                    });
                }
                if (i > 0) {
                    account_managers[accountManagerResult[i - 1].clientId] = tmp;
                }
                for (i = 0; i < ordersResult.length; i++) {
                    if (ordersResult[i].clientId &&
                        account_managers[ordersResult[i].clientId]) {
                        ordersResult[i] = Object.assign(Object.assign({}, ordersResult[i]), { account_managers: account_managers[ordersResult[i].clientId] });
                    }
                }
            }
            catch (e) {
                console.log(e);
                ordersResult = [];
            }
            this.response.status = "ok";
            this.response.draw = draw;
            this.response.recordsTotal = ordersResult.length;
            this.response.recordsFiltered = ordersResult.length;
            this.response.data = ordersResult;
            return this.response;
        });
    }
    addedit(req) {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            const formData = req.body;
            let fetchMethod = 0;
            if (req.query.type == "all") {
                fetchMethod = 2;
            }
            else if (req.query.type == "special") {
                fetchMethod = 1;
            }
            let orderId = formData.orderId;
            orderId = orderId > 0 ? orderId : 0;
            this.user = req.user;
            if (orderId > 0) {
                const result = yield this.editInformation(orderId, formData, fetchMethod);
                yield historyService_1.historyServiceObj.logHistory(req.user, `edited the order ${orderId}`, "order", orderId);
                return result;
            }
            else {
                const result = yield this.addInformation(formData, fetchMethod);
                yield historyService_1.historyServiceObj.logHistory(req.user, `created the order ${result.newOrderId}`, "order", result.newOrderId);
                return result;
            }
        });
    }
    addInformation(formData, fetchMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            let now = new Date();
            let current_time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
            const insertQry = `INSERT INTO orders SET ?`;
            let status = formData.status !== undefined ? formData.status : 1;
            let contractor_price_week = formData.contractor_price_week;
            contractor_price_week =
                contractor_price_week > 0 ? contractor_price_week : 0;
            let contractor_price_weekend = formData.contractor_price_weekend;
            contractor_price_weekend =
                contractor_price_weekend > 0 ? contractor_price_weekend : 0;
            let client_price_week = formData.client_price_week;
            client_price_week = client_price_week > 0 ? client_price_week : 0;
            let client_price_weekend = formData.client_price_weekend;
            client_price_weekend = client_price_weekend > 0 ? client_price_weekend : 0;
            let day = formData.day == "" ? "" : formData.day.join();
            let insertData = {
                order_number: formData.order_number,
                description: formData.description,
                customer: formData.customer,
                price_basis: formData.price_basis,
                day: day,
                client_price: formData.client_price,
                valid_from: formData.valid_from,
                date_of_expiry: formData.date_of_expiry,
                order_type: formData.order_type,
                client_valid_from: formData.client_valid_from,
                client_date_of_expiry: formData.client_date_of_expiry,
                client_price_week: client_price_week,
                client_price_weekend: client_price_weekend,
                contractor: formData.contractor,
                contractor_price: formData.contractor_price,
                contractor_price_week: contractor_price_week,
                contractor_date_of_expiry: formData.contractor_date_of_expiry,
                contractor_price_weekend: contractor_price_weekend,
                contractor_valid_from: formData.contractor_valid_from,
                comment: formData.comment,
                fuel_fee: formData.fuel_fee,
                vehicle_size: formData.vehicle_size,
                number_of_departures: formData.number_of_departures,
                departure_times: formData.departure_times,
                driver_name: formData.driver_name,
                phone: formData.phone,
                tourcode: formData.tourcode,
                password: formData.password,
                status: status,
                created_time: current_time,
                updated_time: current_time,
                manager: formData.manager,
                no_customer_invoice: formData.no_customer_invoice,
                once_per_billing: formData.once_per_billing,
                personId: formData.personId,
                billed_company: formData.billed_company,
                fuel_surcharge: formData.fuel_surcharge
            };
            if (fetchMethod == 0) {
                let sepcial_type = { special_type: false };
                insertData = Object.assign(Object.assign({}, sepcial_type), insertData);
            }
            else {
                let sepcial_type = { special_type: true };
                insertData = Object.assign(Object.assign({}, sepcial_type), insertData);
            }
            const orderInsResp = yield db_1.db.insert(insertQry, insertData);
            const orderId = orderInsResp.insertId;
            if (orderId &&
                formData.clientId &&
                formData.client_price != undefined &&
                formData.client_price >= 0 &&
                formData.valid_from &&
                formData.date_of_expiry) {
                let qry = `INSERT INTO price_history (orderId, entityId, price, valid_from, date_of_expiry, priceType) VALUES ?`;
                yield db_1.db.insert(qry, [
                    [
                        orderId,
                        formData.clientId,
                        formData.client_price,
                        formData.valid_from,
                        formData.date_of_expiry,
                        "client_price"
                    ]
                ]);
            }
            if (orderId &&
                formData.clientId &&
                formData.client_price_week != undefined &&
                formData.client_price_week >= 0 &&
                formData.client_date_of_expiry &&
                formData.client_valid_from) {
                let qry = `INSERT INTO price_history (orderId, entityId, price, valid_from, date_of_expiry, priceType) VALUES ?`;
                yield db_1.db.insert(qry, [
                    [
                        orderId,
                        formData.clientId,
                        formData.client_price_week,
                        formData.client_valid_from,
                        formData.client_date_of_expiry,
                        "client_prce_week"
                    ]
                ]);
            }
            if (orderId &&
                formData.clientId &&
                formData.client_price_weekend != undefined &&
                formData.client_price_weekend >= 0 &&
                formData.client_date_of_expiry &&
                formData.client_valid_from) {
                let qry = `INSERT INTO price_history (orderId, entityId, price, valid_from, date_of_expiry, priceType) VALUES ?`;
                yield db_1.db.insert(qry, [
                    [
                        orderId,
                        formData.clientId,
                        formData.client_price_weekend,
                        formData.client_valid_from,
                        formData.client_date_of_expiry,
                        "client_price_weekend"
                    ]
                ]);
            }
            if (orderId &&
                formData.contractorId &&
                formData.contractor_price_week != undefined &&
                formData.contractor_price_week >= 0 &&
                formData.contractor_valid_from &&
                formData.contractor_date_of_expiry) {
                let qry = `INSERT INTO price_history (orderId, entityId, price, valid_from, date_of_expiry, priceType) VALUES ?`;
                yield db_1.db.insert(qry, [
                    [
                        orderId,
                        formData.contractorId,
                        formData.contractor_price_week,
                        formData.contractor_valid_from,
                        formData.contractor_date_of_expiry,
                        "contractor_price_week"
                    ]
                ]);
            }
            if (orderId &&
                formData.contractorId &&
                formData.contractor_price_weekend != undefined &&
                formData.contractor_price_weekend >= 0 &&
                formData.contractor_date_of_expiry &&
                formData.contractor_valid_from) {
                let qry = `INSERT INTO price_history (orderId, entityId, price, valid_from, date_of_expiry, priceType) VALUES ?`;
                yield db_1.db.insert(qry, [
                    [
                        orderId,
                        formData.contractorId,
                        formData.contractor_price_weekend,
                        formData.contractor_valid_from,
                        formData.contractor_date_of_expiry,
                        "contractor_price_weekend"
                    ]
                ]);
            }
            if (formData.clientId) {
                const insertClientOrderQry = `INSERT INTO clients_order(clientId, orderId, added_date) VALUES ?`;
                yield db_1.db.insert(insertClientOrderQry, [
                    [formData.clientId, orderId, current_time]
                ]);
            }
            if (formData.contractorId) {
                const insertContractorOrderQry = `INSERT INTO contractors_order(contractorId, orderId, added_date) VALUES ?`;
                yield db_1.db.insert(insertContractorOrderQry, [
                    [formData.contractorId, orderId, current_time]
                ]);
            }
            this.response.status = "ok";
            this.response.message = "Order has been inserted successfully.";
            this.response.newOrderId = orderId;
            return this.response;
        });
    }
    editInformation(orderId, formData, fetchMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            let now = new Date();
            let current_time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
            const insertQry = `UPDATE orders SET ? WHERE orderId = ${orderId}`;
            let contractor_price_week = formData.contractor_price_week;
            contractor_price_week =
                contractor_price_week > 0 ? contractor_price_week : 0;
            let contractor_price_weekend = formData.contractor_price_weekend;
            contractor_price_weekend =
                contractor_price_weekend > 0 ? contractor_price_weekend : 0;
            let client_price_week = formData.client_price_week;
            client_price_week = client_price_week > 0 ? client_price_week : 0;
            let client_price_weekend = formData.client_price_weekend;
            client_price_weekend = client_price_weekend > 0 ? client_price_weekend : 0;
            let day = formData.day == "" ? "" : formData.day.join();
            let status = formData.status !== undefined ? formData.status : 1;
            let insertData = {
                order_number: formData.order_number,
                description: formData.description,
                customer: formData.customer,
                price_basis: formData.price_basis,
                day: day,
                client_price: formData.client_price,
                valid_from: formData.valid_from,
                date_of_expiry: formData.date_of_expiry,
                order_type: formData.order_type,
                client_valid_from: formData.client_valid_from,
                client_date_of_expiry: formData.client_date_of_expiry,
                client_price_week: client_price_week,
                client_price_weekend: client_price_weekend,
                contractor: formData.contractor,
                contractor_price: formData.contractor_price,
                contractor_date_of_expiry: formData.contractor_date_of_expiry,
                contractor_price_week: contractor_price_week,
                contractor_price_weekend: contractor_price_weekend,
                contractor_valid_from: formData.contractor_valid_from,
                comment: formData.comment,
                fuel_fee: formData.fuel_fee,
                vehicle_size: formData.vehicle_size,
                number_of_departures: formData.number_of_departures,
                departure_times: formData.departure_times,
                driver_name: formData.driver_name,
                phone: formData.phone,
                tourcode: formData.tourcode,
                password: formData.password,
                updated_time: current_time,
                manager: formData.manager,
                no_customer_invoice: formData.no_customer_invoice,
                once_per_billing: formData.once_per_billing,
                status,
                personId: formData.personId,
                billed_company: formData.billed_company,
                fuel_surcharge: formData.fuel_surcharge
            };
            if (fetchMethod == 0) {
                let sepcial_type = { special_type: false };
                insertData = Object.assign(Object.assign({}, sepcial_type), insertData);
            }
            else {
                let sepcial_type = { special_type: true };
                insertData = Object.assign(Object.assign({}, sepcial_type), insertData);
            }
            if (orderId &&
                formData.clientId &&
                formData.client_price != undefined &&
                formData.client_price >= 0 &&
                formData.valid_from &&
                formData.date_of_expiry) {
                let qry = `INSERT INTO price_history (orderId, entityId, price, valid_from, date_of_expiry, priceType) VALUES ?`;
                yield db_1.db.insert(qry, [
                    [
                        orderId,
                        formData.clientId,
                        formData.client_price,
                        formData.valid_from,
                        formData.date_of_expiry,
                        "client_price"
                    ]
                ]);
            }
            if (orderId &&
                formData.clientId &&
                formData.client_price_week != undefined &&
                formData.client_price_week >= 0 &&
                formData.client_date_of_expiry &&
                formData.client_valid_from) {
                let qry = `INSERT INTO price_history (orderId, entityId, price, valid_from, date_of_expiry, priceType) VALUES ?`;
                yield db_1.db.insert(qry, [
                    [
                        orderId,
                        formData.clientId,
                        formData.client_price_week,
                        formData.client_valid_from,
                        formData.client_date_of_expiry,
                        "client_prce_week"
                    ]
                ]);
            }
            if (orderId &&
                formData.clientId &&
                formData.client_price_weekend != undefined &&
                formData.client_price_weekend >= 0 &&
                formData.client_date_of_expiry &&
                formData.client_valid_from) {
                let qry = `INSERT INTO price_history (orderId, entityId, price, valid_from, date_of_expiry, priceType) VALUES ?`;
                yield db_1.db.insert(qry, [
                    [
                        orderId,
                        formData.clientId,
                        formData.client_price_weekend,
                        formData.client_valid_from,
                        formData.client_date_of_expiry,
                        "client_price_weekend"
                    ]
                ]);
            }
            if (orderId &&
                formData.contractorId &&
                formData.contractor_price_week != undefined &&
                formData.contractor_price_week >= 0 &&
                formData.contractor_valid_from &&
                formData.contractor_date_of_expiry) {
                let qry = `INSERT INTO price_history (orderId, entityId, price, valid_from, date_of_expiry, priceType) VALUES ?`;
                yield db_1.db.insert(qry, [
                    [
                        orderId,
                        formData.contractorId,
                        formData.contractor_price_week,
                        formData.contractor_valid_from,
                        formData.contractor_date_of_expiry,
                        "contractor_price_week"
                    ]
                ]);
            }
            if (orderId &&
                formData.contractorId &&
                formData.contractor_price_weekend != undefined &&
                formData.contractor_price_weekend >= 0 &&
                formData.contractor_date_of_expiry &&
                formData.contractor_valid_from) {
                let qry = `INSERT INTO price_history (orderId, entityId, price, valid_from, date_of_expiry, priceType) VALUES ?`;
                yield db_1.db.insert(qry, [
                    [
                        orderId,
                        formData.contractorId,
                        formData.contractor_price_weekend,
                        formData.contractor_valid_from,
                        formData.contractor_date_of_expiry,
                        "contractor_price_weekend"
                    ]
                ]);
            }
            yield db_1.db.update(insertQry, insertData);
            if (formData.clientId) {
                const clientsOrder = yield db_1.db.selectRow(`SELECT * FROM clients_order WHERE orderId = ${orderId}`);
                if (clientsOrder.orderId == undefined) {
                    const insertClientOrderQry = `INSERT INTO clients_order(clientId, orderId, added_date) VALUES ?`;
                    yield db_1.db.insert(insertClientOrderQry, [
                        [formData.clientId, orderId, current_time]
                    ]);
                }
                else {
                    const updateClientOrderQry = `UPDATE clients_order SET ? WHERE clients_orderId = ${clientsOrder.clients_orderId}`;
                    yield db_1.db.update(updateClientOrderQry, {
                        clientId: formData.clientId,
                        orderId
                    });
                }
            }
            if (formData.contractorId) {
                const contractorsOrder = yield db_1.db.selectRow(`SELECT * FROM contractors_order WHERE orderId = ${orderId}`);
                if (contractorsOrder.orderId == undefined) {
                    const insertContractorOrderQry = `INSERT INTO contractors_order (contractorId, orderId, added_date) VALUES ?`;
                    yield db_1.db.insert(insertContractorOrderQry, [
                        [formData.contractorId, orderId, current_time]
                    ]);
                }
                else {
                    const updateContractorOrderQry = `UPDATE contractors_order SET ? WHERE contractors_orderId = ${contractorsOrder.contractors_orderId}`;
                    yield db_1.db.update(updateContractorOrderQry, {
                        contractorId: formData.contractorId,
                        orderId
                    });
                }
            }
            this.response.status = "ok";
            this.response.message = "Order has been updated successfully.";
            return this.response;
        });
    }
    getOrderDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let orderId = parseInt(data.orderId);
            const qry = `SELECT cam.id, cam.name, cam.phone
                  FROM clients_order AS co
                  LEFT JOIN client_account_manager AS cam ON co.clientId = cam.clientId
                  WHERE co.orderId = ${orderId}
                  ORDER BY cam.order`;
            let account_managers = yield db_1.db.select(qry);
            const orderQry = `SELECT * FROM (
      SELECT  o.*,
              c.clientId, c.client_number, c.name1 AS client_name, com.name1 AS company_name, c.city AS client_city,
              ctr.contractorId, ctr.contractor_number, ctr.name1 AS contractor_name, ctr.city AS contractor_city,
              cam.name as manager_name, cam.phone as manager_phone, p.first_name as person_first_name, p.surname as person_surname
      FROM orders AS o
      LEFT JOIN clients_order AS co ON o.orderId = co.orderId
      LEFT JOIN clients AS c ON c.clientId =  co.clientId
      LEFT JOIN client_account_manager AS cam ON o.manager = cam.id
      LEFT JOIN company AS com ON c.companyId = com.companyId
      LEFT JOIN contractors_order AS cto ON o.orderId = cto.orderId
      LEFT JOIN contractors AS ctr ON ctr.contractorId =  cto.contractorId
      LEFT JOIN persons AS p ON p.personId = o.personId
      WHERE o.orderId = ${orderId} ) AS t1`;
            let orderResult = yield db_1.db.selectRow(orderQry);
            orderResult = Object.assign(Object.assign({}, orderResult), { account_managers });
            this.response.status = "ok";
            this.response.data = orderResult;
            return this.response;
        });
    }
    deleteOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultData = {};
            let orderId = parseInt(data.orderId);
            const deleteTourQry = ` DELETE FROM orders WHERE orderId = ${orderId} `;
            yield db_1.db.delete(deleteTourQry);
            this.response.status = "ok";
            this.response.message = "Order has been deleted successfully.";
            return this.response;
        });
    }
    getNewOrderNo() {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let neworderId = 0;
            const ordersQry = "SELECT orderId FROM orders WHERE 1=1 ORDER BY  orderId DESC LIMIT 1  ";
            const ordersResult = yield db_1.db.selectRow(ordersQry);
            if (ordersResult && ordersResult.orderId > 0) {
                neworderId = parseInt(ordersResult.orderId);
            }
            neworderId = neworderId + 1;
            this.response.status = "ok";
            this.response.neworderId = neworderId;
            return this.response;
        });
    }
    getOpenPositions(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orderby, dir, search, offset, limit } = data;
            let conditionSql = "";
            let orderBySql = orderby
                ? ` ORDER BY ${orderby} ${dir}`
                : ` ORDER BY o.created_time DESC `;
            if (search && search !== undefined) {
                const lowercaseSearch = search.toLowerCase();
                conditionSql = ` AND ( LOWER(order_number) LIKE '%${lowercaseSearch}%'
                            OR LOWER(description) LIKE '%${lowercaseSearch}%'
                            OR LOWER(customer) LIKE '%${lowercaseSearch}%'
                            OR LOWER(o.client_price) LIKE '%${lowercaseSearch}%' 
                            OR LOWER(price_basis) LIKE '%${lowercaseSearch}%' 
                            OR LOWER(order_type) LIKE '%${lowercaseSearch}%' 
                            OR LOWER(service_power_partners) LIKE '%${lowercaseSearch}%'  ) `;
            }
            let countQry = `SELECT count(*) AS total_count
                    FROM clients_order AS co 
                    JOIN clients AS c ON co.clientId = c.clientId
                    JOIN orders AS o ON co.orderId = o.orderId
                    JOIN contractors_order AS cto ON co.orderId = cto.orderId
                    JOIN contractors AS ctr ON cto.contractorId = ctr.contractorId
                    WHERE co.status = 1`;
            conditionSql !== "" && (countQry += conditionSql);
            const totalLenResp = yield db_1.db.selectRow(countQry);
            const recordsTotal = totalLenResp.total_count;
            let ordersQry = `SELECT o.orderId, o.order_number, o.client_price, o.description,
                            o.contractor_price,
                            c.clientId, client_number,  c.name1 AS client_name,
                            ctr.contractorId, ctr.contractor_number, ctr.name1 AS contractor_name
                      FROM clients_order AS co 
                      JOIN clients AS c ON co.clientId = c.clientId
                      JOIN orders AS o ON co.orderId = o.orderId
                      JOIN contractors_order AS cto ON co.orderId = cto.orderId
                      JOIN contractors AS ctr ON cto.contractorId = ctr.contractorId
                      WHERE co.status = 1`;
            conditionSql !== "" && (ordersQry += conditionSql);
            ordersQry += orderBySql;
            ordersQry += limit ? `LIMIT ${limit}` : `LIMIT ${recordsTotal}`;
            limit && offset && (ordersQry += ` OFFSET ${offset}`);
            try {
                const ordersResult = yield db_1.db.select(ordersQry);
                this.response.status = "ok";
                this.response.data = ordersResult;
                return {
                    recordsTotal,
                    recordsFiltered: ordersResult.length,
                    status: "ok",
                    data: ordersResult
                };
            }
            catch (e) {
                return {
                    status: "error",
                    message: e.error
                };
            }
        });
    }
    savePriceHistory(req_data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let insert = req_data.insert;
                let update = req_data.update;
                let orderId = req_data.orderId;
                let deletedIds = req_data.deletedIds;
                let entityId = req_data.entityId;
                let priceType = req_data.priceType;
                let insertData = insert.map((x) => {
                    return [
                        orderId,
                        entityId,
                        x.price,
                        x.valid_from,
                        x.date_of_expiry,
                        priceType
                    ];
                });
                let qry = ` DELETE FROM price_history WHERE id IN (?)`;
                if (deletedIds && deletedIds.length > 0)
                    yield db_1.db.delete(qry, deletedIds);
                qry = `INSERT INTO price_history (orderId, entityId, price, valid_from, date_of_expiry, priceType) VALUES ?`;
                yield db_1.db.insert(qry, insertData);
                for (let x of update) {
                    qry = `UPDATE price_history SET ? WHERE id = ${x.id}`;
                    yield db_1.db.update(qry, {
                        orderId,
                        entityId,
                        priceType,
                        price: x.price,
                        valid_from: x.valid_from,
                        date_of_expiry: x.date_of_expiry
                    });
                }
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
    }
    getPriceHistory(orderId, entityId, priceType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let condition = `priceType = '${priceType}'`;
                if (entityId)
                    condition = `${condition} AND entityId = ${entityId}`;
                if (orderId)
                    condition = `${condition} AND orderId = ${orderId}`;
                let qry = `SELECT * FROM price_history WHERE ${condition} ORDER BY valid_from DESC`;
                let history = yield db_1.db.select(qry);
                return history;
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.orderModelObj = new orderModel();
