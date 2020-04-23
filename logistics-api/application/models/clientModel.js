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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../utils/db");
const historyService_1 = require("../services/historyService");
const dateFormat = require("dateformat");
class clientModel {
    constructor() {
        this.response = {};
        this.user = {};
    }
    getClientList(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.response = {};
                let req_data = request.body;
                let draw = req_data.draw;
                let length = req_data.length;
                let order = req_data.order;
                let search = req_data.search;
                let start = req_data.start;
                let status = req_data.status;
                let columns = req_data.columns;
                let global = req_data.global;
                let recordsTotal = 0;
                let filterValue = "";
                if (search) {
                    filterValue = search.value;
                }
                let cond = "";
                let orderby = "";
                if (order && order.length > 0) {
                    let column = order[0].column;
                    let dir = order[0].dir;
                    if (column == 0) {
                        orderby = " clients.client_number " + dir;
                    }
                    else if (column == 1) {
                        orderby = " clients.name1 ";
                    }
                    else if (column == 2) {
                        orderby = " clients.name2 " + dir;
                    }
                    else if (column == 3) {
                        orderby = " clients.zipcode " + dir;
                    }
                    else if (column == 4) {
                        orderby = " clients.city " + dir;
                    }
                    else {
                        orderby = " clients.created_time DESC ";
                    }
                }
                else {
                    orderby = " clients.created_time DESC ";
                }
                orderby = "  ORDER BY " + orderby + " ";
                if (!length)
                    length = 234242134234;
                let limit = ` LIMIT ${length} `;
                if (start != undefined) {
                    limit += ` OFFSET ${start}`;
                }
                if (filterValue && filterValue !== undefined) {
                    filterValue = filterValue.toLowerCase();
                    cond = ` AND ( LOWER(client_number) LIKE '%${filterValue}%' OR LOWER(clients.name1) LIKE '%${filterValue}%' OR LOWER(clients.name2) LIKE '%${filterValue}%' OR LOWER(clients.street) LIKE '%${filterValue}%' OR LOWER(clients.zipcode) LIKE '%${filterValue}%' OR LOWER(clients.phone1) LIKE '%${filterValue}%' OR LOWER(clients.phone2) LIKE '%${filterValue}%' OR LOWER(clients.mobile) LIKE '%${filterValue}%' OR LOWER(clients.email) LIKE '%${filterValue}%'  ) `;
                }
                if (columns) {
                    columns.forEach((item, index) => {
                        if (item.name &&
                            item.name != "" &&
                            item.search &&
                            item.search.value &&
                            item.search.value != "") {
                            cond += ` AND LOWER(clients.${item.name}) LIKE '%${item.search.value}%' `;
                        }
                    });
                }
                if (status == 1) {
                    cond = cond + ` AND clients.status = 1`;
                }
                else if (status == 0) {
                    cond = cond + ` AND clients.status = 0`;
                }
                let select = "";
                if (columns && global != undefined && global == false) {
                    columns.forEach((item, index) => {
                        if (index > 0)
                            select += ` ,clients.${item.name}`;
                        else
                            select += `clients.${item.name}`;
                    });
                }
                const clientcountQry = "SELECT count(*) AS total_count FROM clients WHERE 1 = 1 " + cond;
                const totalLenResp = yield db_1.db.selectRow(clientcountQry);
                recordsTotal = totalLenResp.total_count;
                if (select == "")
                    select = "clients.*";
                select = select + " , company.code as company_code ";
                const clientQry = `SELECT ${select}, client_account_manager.id as managerId, client_account_manager.name, client_account_manager.phone, locations.*
        FROM clients
        LEFT JOIN company
        ON clients.companyId = company.companyId
        LEFT JOIN client_account_manager
        ON client_account_manager.clientId = clients.clientId
        LEFT JOIN locations
        ON locations.id = clients.locationId
        WHERE 1 = 1 ` +
                    cond +
                    orderby +
                    ", client_account_manager.order ";
                const clientResult = yield db_1.db.select(clientQry);
                let result = [];
                let account_managers = [];
                let i = 0, j = 0;
                for (; i < clientResult.length; i++) {
                    if (i == 0) {
                        result.push(clientResult[i]);
                        j++;
                    }
                    if (i > 0 && clientResult[i].clientId != clientResult[i - 1].clientId) {
                        result[j - 1] = Object.assign(Object.assign({}, result[j - 1]), { account_managers });
                        delete result[j - 1].name;
                        delete result[j - 1].phone;
                        result.push(clientResult[i]);
                        j++;
                        account_managers = [];
                    }
                    if (clientResult[i].managerId) {
                        account_managers.push({
                            id: clientResult[i].managerId,
                            name: clientResult[i].name,
                            phone: clientResult[i].phone
                        });
                    }
                }
                if (j > 0) {
                    delete result[j - 1].managerId;
                    delete result[j - 1].name;
                    delete result[j - 1].phone;
                    result[j - 1] = Object.assign(Object.assign({}, result[j - 1]), { account_managers });
                }
                for (i = 0; i < result.length; i++) {
                    const location = {
                        lat: result[i].lat,
                        lng: result[i].lng,
                        zoom: result[i].zoom,
                        address: result[i].address,
                        marker: {
                            lat: result[i].marker_lat,
                            lng: result[i].marker_lng,
                            draggable: result[i].marker_draggable == 1 ? true : false
                        }
                    };
                    delete result[i].lat;
                    delete result[i].lng;
                    delete result[i].marker_lat;
                    delete result[i].marker_lng;
                    delete result[i].marker_draggable;
                    delete result[i].zoom;
                    delete result[i].address;
                    result[i] = Object.assign(Object.assign({}, result[i]), { location });
                }
                result = result.filter((x, i) => {
                    if (i >= start && i < start + length)
                        return true;
                });
                this.response.status = "ok";
                this.response.draw = draw;
                this.response.recordsTotal = recordsTotal;
                this.response.recordsFiltered = recordsTotal;
                this.response.data = result;
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
    addedit(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = req.body;
            const basicData = JSON.parse(formData.basicData);
            let clientId = basicData.clientId;
            clientId = clientId > 0 ? clientId : 0;
            this.user = req.user;
            let result;
            if (clientId > 0) {
                result = yield this.editInformation(clientId, formData);
                yield historyService_1.historyServiceObj.logHistory(req.user, `updated the client ${clientId}`, "client", clientId);
            }
            else {
                result = yield this.addInformation(formData);
                yield historyService_1.historyServiceObj.logHistory(req.user, `created the client ${result.newClientId}`, "client", result.newClientId);
            }
            return result;
        });
    }
    addInformation(formData) {
        var e_1, _a, e_2, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const basicData = JSON.parse(formData.basicData);
                const personList = formData.personList !== "[]" ? JSON.parse(formData.personList) : [];
                const comment = formData.comment;
                const orderDataList = formData.orderDataList !== "[]"
                    ? JSON.parse(formData.orderDataList)
                    : [];
                const priceHistory = formData.priceHistory !== "[]" ? JSON.parse(formData.priceHistory) : [];
                let contractFiles_name = formData.contractFiles_name;
                let now = new Date();
                let current_time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                let ustr_mandatory = basicData.ustr_mandatory ? 1 : 0;
                let locationId = null;
                if (basicData.location) {
                    const qry = "INSERT INTO locations (lat, lng, marker_lat, marker_lng, marker_draggable, zoom, address ) VALUES ?";
                    const lctResp = yield db_1.db.insert(qry, [
                        [
                            basicData.location.lat,
                            basicData.location.lng,
                            basicData.location.marker.lat,
                            basicData.location.marker.lng,
                            basicData.location.marker.draggable,
                            basicData.location.zoom,
                            basicData.location.address
                        ]
                    ]);
                    locationId = lctResp.insertId;
                }
                const insertQry = `INSERT INTO clients SET ?`;
                let insertData = {
                    client_number: basicData.client_number,
                    companyId: basicData.companyId,
                    name1: basicData.name1,
                    name2: basicData.name2,
                    street: basicData.street,
                    zipcode: basicData.zipcode,
                    city: basicData.city,
                    phone1: basicData.phone1,
                    phone2: basicData.phone2,
                    mobile: basicData.mobile,
                    fax: basicData.fax,
                    last_billed: basicData.last_billed,
                    email: basicData.email,
                    rech_rhythm: basicData.rech_rhythm,
                    zahl_rhythm: basicData.zahl_rhythm,
                    contract_start_date: basicData.contract_start_date,
                    contract_end_date: basicData.contract_end_date,
                    termination_time: basicData.termination_time,
                    termination_time_value: basicData.termination_time_value,
                    state: basicData.state,
                    billed: basicData.billed,
                    tax_identification_number: basicData.tax_identification_number,
                    bank: basicData.bank,
                    iban: basicData.iban,
                    bic: basicData.bic,
                    national_tax_number: basicData.national_tax_number,
                    ustr_mandatory: ustr_mandatory,
                    ustr_mandatory_value: basicData.ustr_mandatory_value,
                    currency: basicData.currency,
                    vendor_number: basicData.vendor_number,
                    print_branch_invoice: basicData.print_branch_invoice,
                    comment: comment,
                    cost_center: basicData.cost_center,
                    alternative_invoice_recipient: basicData.alternative_invoice_recipient,
                    created_time: current_time,
                    updated_time: current_time,
                    debitor_no: basicData.debitor_no,
                    locationId
                };
                if (contractFiles_name !== undefined && contractFiles_name !== null) {
                    insertData["contract_file"] = contractFiles_name;
                }
                const clientResp = yield db_1.db.insert(insertQry, insertData);
                const clientId = clientResp.insertId;
                // account managers add
                if (basicData.account_managers) {
                    const qry = "INSERT INTO client_account_manager (clientId, `name`, phone, `order` ) VALUES ?";
                    const managers = basicData.account_managers.map((x, i) => {
                        return [clientId, x.name, x.phone, i];
                    });
                    yield db_1.db.insert(qry, managers);
                }
                if (personList && personList.length > 0) {
                    const insertPersonQry = `INSERT INTO clients_contact_person (clientId, personId, added_date) VALUES ?`;
                    let insertPersonData = [];
                    try {
                        for (var personList_1 = __asyncValues(personList), personList_1_1; personList_1_1 = yield personList_1.next(), !personList_1_1.done;) {
                            const perId = personList_1_1.value;
                            if (perId > 0) {
                                insertPersonData.push([clientId, perId, current_time]);
                                const upClient = ` UPDATE persons SET status = 1 WHERE personId = ${perId}`;
                                yield db_1.db.update(upClient);
                            }
                            insertPersonData = yield Promise.all(insertPersonData);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (personList_1_1 && !personList_1_1.done && (_a = personList_1.return)) yield _a.call(personList_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    yield db_1.db.insert(insertPersonQry, insertPersonData);
                }
                if (orderDataList && orderDataList.length > 0) {
                    const insertToutsonQry = `INSERT INTO clients_order(clientId, orderId, added_date) VALUES ?`;
                    let insertToutsonData = [];
                    try {
                        for (var orderDataList_1 = __asyncValues(orderDataList), orderDataList_1_1; orderDataList_1_1 = yield orderDataList_1.next(), !orderDataList_1_1.done;) {
                            const orderId = orderDataList_1_1.value;
                            insertToutsonData.push([clientId, orderId, current_time]);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (orderDataList_1_1 && !orderDataList_1_1.done && (_b = orderDataList_1.return)) yield _b.call(orderDataList_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    insertToutsonData = yield Promise.all(insertToutsonData);
                    yield db_1.db.insert(insertToutsonQry, insertToutsonData);
                }
                if (priceHistory && priceHistory.length > 0) {
                    let history = priceHistory.map((x) => {
                        return [
                            x.orderId,
                            clientId,
                            x.price,
                            x.valid_from,
                            x.date_of_expiry,
                            x.priceType
                        ];
                    });
                    let qry = `INSERT INTO price_history (orderId, entityId, price, valid_from, date_of_expiry, priceType) VALUES ?`;
                    yield db_1.db.insert(qry, history);
                }
                this.response = {};
                this.response.status = "ok";
                this.response.message = "Client Has been inserted successfully.";
                this.response.newClientId = clientId;
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
    editInformation(clientId, formData) {
        var e_3, _a, e_4, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const basicData = JSON.parse(formData.basicData);
                let contractFiles_name = formData.contractFiles_name;
                contractFiles_name =
                    contractFiles_name !== undefined && contractFiles_name !== null
                        ? contractFiles_name
                        : "";
                const personList = formData.personList != "[]" ? JSON.parse(formData.personList) : [];
                const deleteClientPersons = formData.deleteClientPersons != "[]"
                    ? JSON.parse(formData.deleteClientPersons)
                    : [];
                const comment = formData.comment;
                const orderDataList = formData.orderDataList != "[]"
                    ? JSON.parse(formData.orderDataList)
                    : [];
                const deleteClientOrders = formData.deleteClientOrders != "[]"
                    ? JSON.parse(formData.deleteClientOrders)
                    : [];
                const priceHistory = formData.priceHistory !== "[]" ? JSON.parse(formData.priceHistory) : [];
                let now = new Date();
                let current_time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                let ustr_mandatory = basicData.ustr_mandatory ? 1 : 0;
                const clientQry = "SELECT * FROM clients WHERE clientId = ?";
                const client = yield db_1.db.selectRow(clientQry, [clientId]);
                if (!client) {
                    return {
                        status: "error",
                        message: "Item not found"
                    };
                }
                let locationId = null;
                let qry = "";
                if (basicData.location) {
                    if (client.locationId) {
                        qry = `UPDATE locations SET ? WHERE id = ${client.locationId}`;
                        const updateData = {
                            lat: basicData.location.lat,
                            lng: basicData.location.lng,
                            ["marker_lat"]: basicData.location.marker.lat,
                            ["marker_lng"]: basicData.location.marker.lng,
                            ["marker_draggable"]: basicData.location.marker.draggable,
                            zoom: basicData.location.zoom,
                            address: basicData.location.address
                        };
                        yield db_1.db.update(qry, updateData);
                        locationId = client.locationId;
                    }
                    else {
                        qry =
                            "INSERT INTO locations (lat, lng, marker_lat, marker_lng, marker_draggable, zoom, address ) VALUES ?";
                        const lctResp = yield db_1.db.insert(qry, [
                            [
                                basicData.location.lat,
                                basicData.location.lng,
                                basicData.location.marker.lat,
                                basicData.location.marker.lng,
                                basicData.location.marker.draggable,
                                basicData.location.zoom,
                                basicData.location.address
                            ]
                        ]);
                        locationId = lctResp.insertId;
                    }
                }
                const insertQry = `UPDATE clients SET ? WHERE clientId = ${clientId} `;
                historyService_1.historyServiceObj.logHistory(this.user, `updated the client ${clientId} 's overview`, "client", clientId);
                const insertData = {
                    client_number: basicData.client_number,
                    companyId: basicData.companyId,
                    name1: basicData.name1,
                    name2: basicData.name2,
                    street: basicData.street,
                    zipcode: basicData.zipcode,
                    city: basicData.city,
                    phone1: basicData.phone1,
                    phone2: basicData.phone2,
                    mobile: basicData.mobile,
                    fax: basicData.fax,
                    last_billed: basicData.last_billed,
                    email: basicData.email,
                    rech_rhythm: basicData.rech_rhythm,
                    zahl_rhythm: basicData.zahl_rhythm,
                    contract_start_date: basicData.contract_start_date,
                    contract_end_date: basicData.contract_end_date,
                    termination_time: basicData.termination_time,
                    termination_time_value: basicData.termination_time_value,
                    state: basicData.state,
                    billed: basicData.billed,
                    tax_identification_number: basicData.tax_identification_number,
                    bank: basicData.bank,
                    iban: basicData.iban,
                    bic: basicData.bic,
                    national_tax_number: basicData.national_tax_number,
                    ustr_mandatory: ustr_mandatory,
                    ustr_mandatory_value: basicData.ustr_mandatory_value,
                    currency: basicData.currency,
                    vendor_number: basicData.vendor_number,
                    print_branch_invoice: basicData.print_branch_invoice,
                    alternative_invoice_recipient: basicData.alternative_invoice_recipient,
                    comment: comment,
                    cost_center: basicData.cost_center,
                    updated_time: current_time,
                    debitor_no: basicData.debitor_no,
                    locationId
                };
                if (contractFiles_name !== "")
                    insertData["contract_file"] = contractFiles_name;
                const result = yield db_1.db.update(insertQry, insertData);
                // delete old account managers
                qry = ` DELETE FROM client_account_manager WHERE clientId = ${clientId} `;
                yield db_1.db.delete(qry);
                // account managers add
                if (basicData.account_managers) {
                    const qry = "INSERT INTO client_account_manager (clientId, `name`, phone, `order` ) VALUES ?";
                    const managers = basicData.account_managers.map((x, i) => {
                        return [clientId, x.name, x.phone, i];
                    });
                    yield db_1.db.insert(qry, managers);
                }
                if (deleteClientPersons && deleteClientPersons.length > 0) {
                    let dpIds = deleteClientPersons.join();
                    const deletecpQry = ` DELETE FROM clients_contact_person WHERE clientId = ${clientId} AND personId IN (${dpIds})`;
                    yield db_1.db.delete(deletecpQry);
                    historyService_1.historyServiceObj.logHistory(this.user, `deleted some of the client ${clientId}'s contacts persons`, "client", clientId);
                }
                if (personList && personList.length > 0) {
                    const insertPersonQry = `INSERT INTO clients_contact_person (clientId, personId, added_date) VALUES ?`;
                    let insertPersonData = [];
                    try {
                        for (var personList_2 = __asyncValues(personList), personList_2_1; personList_2_1 = yield personList_2.next(), !personList_2_1.done;) {
                            const perId = personList_2_1.value;
                            if (perId > 0) {
                                insertPersonData.push([clientId, , current_time]);
                            }
                            insertPersonData = yield Promise.all(insertPersonData);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (personList_2_1 && !personList_2_1.done && (_a = personList_2.return)) yield _a.call(personList_2);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    yield db_1.db.insert(insertPersonQry, insertPersonData);
                    historyService_1.historyServiceObj.logHistory(this.user, `added some of the client ${clientId}'s contacts persons`, "client", clientId);
                }
                if (deleteClientOrders && deleteClientOrders.length > 0) {
                    let doIds = deleteClientOrders.join();
                    const deleteTourQry = ` DELETE FROM clients_order WHERE clientId = ${clientId} AND orderId IN (${doIds}) `;
                    yield db_1.db.delete(deleteTourQry);
                    historyService_1.historyServiceObj.logHistory(this.user, `deleted some of the client ${clientId}'s orders`, "client", clientId);
                }
                if (orderDataList && orderDataList.length > 0) {
                    const insertToutsonQry = `INSERT INTO clients_order(clientId, orderId, added_date) VALUES ?`;
                    let insertToutsonData = [];
                    try {
                        for (var orderDataList_2 = __asyncValues(orderDataList), orderDataList_2_1; orderDataList_2_1 = yield orderDataList_2.next(), !orderDataList_2_1.done;) {
                            const orderId = orderDataList_2_1.value;
                            insertToutsonData.push([clientId, orderId, current_time]);
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (orderDataList_2_1 && !orderDataList_2_1.done && (_b = orderDataList_2.return)) yield _b.call(orderDataList_2);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                    insertToutsonData = yield Promise.all(insertToutsonData);
                    yield db_1.db.insert(insertToutsonQry, insertToutsonData);
                    historyService_1.historyServiceObj.logHistory(this.user, `added some of the client ${clientId}'s orders`, "client", clientId);
                }
                if (priceHistory && priceHistory.length > 0) {
                    let history = priceHistory.map((x) => {
                        return [
                            x.orderId,
                            clientId,
                            x.price,
                            x.valid_from,
                            x.date_of_expiry,
                            x.priceType
                        ];
                    });
                    let qry = `INSERT INTO price_history (orderId, entityId, price, valid_from, date_of_expiry, priceType) VALUES ?`;
                    yield db_1.db.insert(qry, history);
                }
                this.response = {};
                this.response.status = "ok";
                this.response.message = result.message;
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
    getClientDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let resultData = {};
            let clientId = parseInt(data.clientId);
            try {
                const clientQry = `SELECT t1.*, company.code as company_code, t2.name1 as alternative_invoice_recipient_name, t3.*
        FROM clients AS t1
        LEFT JOIN company ON company.companyId=t1.companyId
        LEFT JOIN clients AS t2 ON t1.alternative_invoice_recipient = t2.clientId
        LEFT JOIN locations AS t3 ON t1.locationId = t3.id
        WHERE t1.clientId = ? `;
                let clientResult = yield db_1.db.selectRow(clientQry, [clientId]);
                const qry = "SELECT * FROM client_account_manager WHERE clientId = ? ORDER BY `order`";
                let account_managers = yield db_1.db.select(qry, [clientId]);
                account_managers = account_managers.map((x) => ({
                    name: x.name,
                    phone: x.phone
                }));
                const location = {
                    lat: clientResult.lat,
                    lng: clientResult.lng,
                    zoom: clientResult.zoom,
                    address: clientResult.address,
                    marker: {
                        lat: clientResult.marker_lat,
                        lng: clientResult.marker_lng,
                        draggable: clientResult.marker_draggable == 1 ? true : false
                    }
                };
                delete clientResult.lat;
                delete clientResult.lng;
                delete clientResult.marker_lat;
                delete clientResult.marker_lng;
                delete clientResult.marker_draggable;
                delete clientResult.zoom;
                delete clientResult.address;
                clientResult = Object.assign(Object.assign({}, clientResult), { location, account_managers });
                const contctPersonQry = "SELECT * FROM clients_contact_person WHERE  clientId = ? ";
                const contctPersonResult = yield db_1.db.select(contctPersonQry, [clientId]);
                const tourQry = "SELECT * FROM clients_order WHERE  clientId = ? ";
                const tourResult = yield db_1.db.select(tourQry, [clientId]);
                const specialorderQry = "SELECT * FROM clients_special_order WHERE  clientId = ? ";
                const specialorderResult = yield db_1.db.select(specialorderQry, [clientId]);
                resultData.basicData = clientResult;
                resultData.presonIdsList = contctPersonResult;
                resultData.tourList = tourResult;
                resultData.specialtourData = specialorderResult;
                this.response.status = "ok";
                this.response.data = resultData;
                return this.response;
            }
            catch (e) {
                return {
                    status: "error",
                    message: e.message
                };
            }
        });
    }
    deleteClient(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultData = {};
            let clientId = parseInt(data.clientId);
            const deleteClientQry = ` DELETE FROM clients WHERE clientId = ${clientId} `;
            let result = yield db_1.db.delete(deleteClientQry);
            historyService_1.historyServiceObj.logHistory(this.user, `deleted the client ${clientId}`, "client", clientId);
            const deletecpQry = ` DELETE FROM clients_contact_person WHERE clientId = ${clientId} `;
            yield db_1.db.delete(deletecpQry);
            const deleteTourQry = ` DELETE FROM clients_order WHERE clientId = ${clientId} `;
            yield db_1.db.delete(deleteTourQry);
            const deleteSpecialTourQry = ` DELETE FROM clients_special_order WHERE clientId = ${clientId} `;
            yield db_1.db.delete(deleteSpecialTourQry);
            const deleteAccountManager = ` DELETE FROM client_account_manager WHERE clientId = ${clientId} `;
            yield db_1.db.delete(deleteAccountManager);
            this.response = {};
            this.response.status = "ok";
            this.response.data = {
                affectedRows: result.affectedRows,
                message: "operation successfully completed"
            };
            return this.response;
        });
    }
    getNewClientNo() {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let newclientId = 0;
            const clientQry = "SELECT clientId FROM clients ORDER BY  clientId DESC LIMIT 1  ";
            const clientResult = yield db_1.db.selectRow(clientQry);
            if (clientResult && clientResult.clientId > 0) {
                newclientId = parseInt(clientResult.clientId);
            }
            newclientId = newclientId + 1;
            this.response.status = "ok";
            this.response.newclientId = newclientId;
            return this.response;
        });
    }
    clientPersonList(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let req_data = request.body;
            let draw = req_data.draw;
            let length = req_data.length;
            let order = req_data.order;
            let search = req_data.search;
            let start = req_data.start;
            let recordsTotal = 0;
            let filterValue = "";
            let clientId = 0;
            let newPersonIds = [];
            let deletedPersonIds = [];
            if (search) {
                filterValue = search.value;
                clientId = search.clientId;
                newPersonIds = search.newPersonIds;
                deletedPersonIds = search.deletedPersonIds;
            }
            clientId =
                clientId && clientId !== undefined && clientId !== null && clientId > 0
                    ? clientId
                    : 0;
            let cond = "";
            if (newPersonIds && newPersonIds.length > 0) {
                let newPIds = newPersonIds.join();
                if (clientId > 0)
                    cond += ` AND ( (CCP.clientId = ${clientId} AND P.status = 1) OR P.personId IN(${newPIds}) )`;
                else
                    cond += ` AND ( P.personId IN(${newPIds}))`;
            }
            else {
                cond += ` AND CCP.clientId = ${clientId} AND P.status = 1`;
            }
            if (deletedPersonIds && deletedPersonIds.length > 0) {
                let dpIds = deletedPersonIds.join();
                cond += ` AND P.personId NOT IN(${dpIds}) `;
            }
            let orderby = "";
            if (order && order.length > 0) {
                let column = order[0].column;
                let dir = order[0].dir;
                if (column == 0) {
                    orderby = " P.person_number ";
                    orderby += dir;
                }
                else if (column == 1) {
                    orderby = " P.salutation ";
                    orderby += dir;
                }
                else if (column == 2) {
                    orderby = " P.first_name ";
                    orderby += dir;
                }
                else if (column == 3) {
                    orderby = " P.surname ";
                    orderby += dir;
                }
                else if (column == 4) {
                    orderby = " P.phone ";
                    orderby += dir;
                }
                else if (column == 5) {
                    orderby = " P.email ";
                    orderby += dir;
                }
                else {
                    orderby = " created_time DESC ";
                }
            }
            else {
                orderby = " created_time DESC ";
            }
            orderby = "  ORDER BY " + orderby + " ";
            let limit = " LIMIT  " + start + " , " + length + " ";
            if (filterValue && filterValue !== undefined) {
                filterValue = filterValue.toLowerCase();
                cond = ` AND ( LOWER(person_number) LIKE '%${filterValue}%' OR LOWER(salutation) LIKE '%${filterValue}%' OR LOWER(first_name) LIKE '%${filterValue}%' OR LOWER(surname) LIKE '%${filterValue}%' OR LOWER(phone) LIKE '%${filterValue}%'  OR LOWER(email) LIKE '%${filterValue}%'   ) `;
            }
            const personcountQry = "SELECT count(*) AS total_count FROM persons P LEFT JOIN clients_contact_person CCP ON CCP.personId =P.personId AND CCP.clientId = " +
                clientId +
                "  WHERE 1=1  " +
                cond;
            const totalLenResp = yield db_1.db.selectRow(personcountQry);
            recordsTotal = totalLenResp.total_count;
            const personQry = "SELECT CCP.clients_contact_personId,  CCP.clientId , CCP.added_date , P.personId, P.person_number, P.salutation , P.first_name, P.surname, P.department, P.phone, P.email  FROM persons P LEFT JOIN clients_contact_person CCP ON CCP.personId =P.personId AND CCP.clientId = " +
                clientId +
                "  WHERE 1=1 " +
                cond +
                orderby +
                limit;
            const personResult = yield db_1.db.select(personQry);
            this.response.status = "ok";
            this.response.draw = draw;
            this.response.recordsTotal = recordsTotal;
            this.response.recordsFiltered = recordsTotal;
            this.response.data = personResult;
            return this.response;
        });
    }
    deleteClientPerson(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let req_data = request.body;
            let clients_contact_personId = req_data.clients_contact_personId;
            if (clients_contact_personId > 0) {
                const deleteClientQry = ` DELETE FROM clients_contact_person WHERE clients_contact_personId = ${clients_contact_personId} `;
                yield db_1.db.delete(deleteClientQry);
            }
            this.response.status = "ok";
            this.response.message = "Client person Has been deleted successfully.";
            return this.response;
        });
    }
    clientOrderList(request) {
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
            let recordsTotal = 0;
            let filterValue = "";
            let clientId = 0;
            let newOrderIds = [];
            let deletedOrderIds = [];
            if (search) {
                filterValue = search.value;
                clientId = search.clientId;
                newOrderIds = search.newOrderIds;
                deletedOrderIds = search.deletedOrderIds;
            }
            clientId =
                clientId && clientId !== undefined && clientId !== null && clientId > 0
                    ? clientId
                    : 0;
            let cond = "";
            if (newOrderIds && newOrderIds.length > 0) {
                let newPIds = newOrderIds.join();
                if (clientId > 0)
                    cond += ` AND ( (co.clientId = ${clientId} ) OR o.orderId IN(${newPIds}) )`;
                else
                    cond += ` AND ( o.orderId IN(${newPIds}))`;
            }
            else {
                cond += ` AND co.clientId = ${clientId}`;
            }
            if (deletedOrderIds && deletedOrderIds.length > 0) {
                let doIds = deletedOrderIds.join();
                cond += ` AND o.orderId NOT IN  ( ${doIds} )`;
            }
            if (status == 1)
                cond += " AND o.status = 1 ";
            if (status == 0)
                cond += " AND o.status = 0 ";
            let orderby = "";
            if (order && order.length > 0) {
                let column = order[0].column;
                let dir = order[0].dir;
                if (column == 0) {
                    orderby = " o.order_number ";
                    orderby += dir;
                }
                else if (column == 1) {
                    orderby = " o.customer ";
                    orderby += dir;
                }
                else if (column == 2) {
                    orderby = " o.client_price ";
                    orderby += dir;
                }
                else if (column == 3) {
                    orderby = " o.price_basis ";
                    orderby += dir;
                }
                else {
                    orderby = " co.added_date DESC ";
                }
            }
            else {
                orderby = " co.added_date DESC ";
            }
            orderby = "  ORDER BY " + orderby + " ";
            let limit = " LIMIT  " + start + " , " + length + " ";
            if (filterValue && filterValue !== undefined) {
                filterValue = filterValue.toLowerCase();
                cond = ` AND ( LOWER(o.order_number) LIKE '%${filterValue}%' OR LOWER(o.customer) LIKE '%${filterValue}%' OR LOWER(o.client_price) LIKE '%${filterValue}%' OR LOWER(o.price_basis)  ) `;
            }
            if (status)
                if (fetchMethod == 0) {
                    cond += ` AND o.special_type = false `;
                }
                else if (fetchMethod == 1) {
                    cond += ` AND o.special_type = true `;
                }
            const ordercountQry = "SELECT count(o.orderId    ) AS total_count FROM orders AS o LEFT JOIN clients_order AS co ON co.orderId =o.orderId AND co.clientId = " +
                clientId +
                "  WHERE 1=1  " +
                cond;
            const totalLenResp = yield db_1.db.selectRow(ordercountQry);
            recordsTotal = totalLenResp.total_count;
            const ordersQry = `SELECT   o.orderId, o.order_number, o.description, o.client_price, o.client_price_week, o.client_price_weekend, o.contractor_price, o.contractor_price_week, o.client_price_weekend,
                c.clientId, c.client_number, c.name1 AS client_name, c.city AS client_city,
                ctr.contractorId, ctr.contractor_number, ctr.name1 AS contractor_name, ctr.city AS contractor_city,
                co.clients_orderId, o.manager, cam.name as manager_name, cam.phone as manager_phone, com.name1 as company_name
      FROM orders AS o
      LEFT JOIN clients_order AS co ON o.orderId = co.orderId
      LEFT JOIN clients AS c ON c.clientId =  co.clientId
      LEFT JOIN contractors_order AS cto ON o.orderId = cto.orderId
      LEFT JOIN contractors AS ctr ON ctr.contractorId =  cto.contractorId
      LEFT JOIN client_account_manager AS cam ON cam.id = o.manager
      LEFT JOIN company AS com ON com.companyId = c.companyId
      WHERE co.clientId = ${clientId}` +
                cond +
                orderby +
                limit;
            const orderResult = yield db_1.db.select(ordersQry);
            const qry = "SELECT * FROM client_account_manager WHERE clientId = ? ORDER BY `order`";
            let account_managers = yield db_1.db.select(qry, [clientId]);
            account_managers = account_managers.map((x) => ({
                name: x.name,
                phone: x.phone
            }));
            for (let i = 0; i < orderResult.length; i++) {
                orderResult[i] = Object.assign(Object.assign({}, orderResult[i]), { account_managers });
            }
            this.response = {};
            this.response.status = "ok";
            this.response.draw = draw;
            this.response.recordsTotal = recordsTotal;
            this.response.recordsFiltered = recordsTotal;
            this.response.data = orderResult;
            return this.response;
        });
    }
    deleteClientOrder(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let req_data = request.body;
            let clients_orderId = req_data.clients_orderId;
            if (clients_orderId > 0) {
                const deleteClientQry = ` DELETE FROM clients_order WHERE clients_orderId = ${clients_orderId} `;
                yield db_1.db.delete(deleteClientQry);
            }
            this.response.status = "ok";
            this.response.message = "Client Order has been deleted successfully.";
            return this.response;
        });
    }
    getPriceList(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const priceListQuery = `SELECT o.client_price, DATE_FORMAT(o.valid_from, "%d-%m-%Y") as valid_from, DATE_FORMAT(o.date_of_expiry, "%d-%m-%Y") as date_of_expiry
                                FROM clients_order AS co
                                LEFT JOIN orders AS o ON co.orderId = o.orderId
                                WHERE co.clientId = ${clientId}
                                ORDER BY o.valid_from ASC`;
            const list = yield db_1.db.select(priceListQuery);
            return list;
        });
    }
    getAccountManagers(clientId) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.clientModelObj = new clientModel();
