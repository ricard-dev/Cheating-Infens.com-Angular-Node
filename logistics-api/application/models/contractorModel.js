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
class contractorModel {
    constructor() {
        this.response = {};
        this.user = {};
    }
    getContractorList(request) {
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
                        orderby = " contractor_number ";
                    }
                    else if (column == 1) {
                        orderby = " name1 ";
                    }
                    else if (column == 2) {
                        orderby = " name2 ";
                    }
                    else if (column == 3) {
                        orderby = " phone1 ";
                    }
                    else if (column == 4) {
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
                if (start != undefined) {
                    limit += ` OFFSET ${start}`;
                }
                if (filterValue && filterValue !== undefined) {
                    filterValue = filterValue.toLowerCase();
                    cond = ` AND ( LOWER(contractor_number) LIKE '%${filterValue}%' OR LOWER(name1) LIKE '%${filterValue}%' OR LOWER(name2) LIKE '%${filterValue}%' OR LOWER(street) LIKE '%${filterValue}%' OR LOWER(zipcode) LIKE '%${filterValue}%' OR LOWER(phone1) LIKE '%${filterValue}%' OR LOWER(phone2) LIKE '%${filterValue}%' OR LOWER(mobile) LIKE '%${filterValue}%' OR LOWER(email) LIKE '%${filterValue}%'  ) `;
                }
                if (columns) {
                    columns.forEach((item, index) => {
                        if (item.name != "" && item.search.value != "") {
                            cond += ` AND LOWER(${item.name}) LIKE '%${item.search.value}%' `;
                        }
                    });
                }
                if (status == 1) {
                    cond = cond + ` AND status = 1`;
                }
                else if (status == 0) {
                    cond = cond + ` AND status = 0`;
                }
                const contractorcountQry = "SELECT count(*) AS total_count FROM contractors WHERE 1 = 1 " + cond;
                const totalLenResp = yield db_1.db.selectRow(contractorcountQry);
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
                const contractorQry = `SELECT ${select} FROM contractors
        LEFT JOIN locations ON contractors.locationId = locations.id
        WHERE 1 = 1 ` +
                    cond +
                    orderby +
                    limit;
                let result = yield db_1.db.select(contractorQry);
                for (let i = 0; i < result.length; i++) {
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
                this.response.status = "ok";
                this.response.draw = draw;
                this.response.recordsTotal = recordsTotal;
                this.response.recordsFiltered = recordsTotal;
                this.response.data = result;
                return this.response;
            }
            catch (e) {
                return {
                    status: false,
                    message: e.message
                };
            }
        });
    }
    getContractorsForPayment(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let filterValue = query.search;
            let orderby = query.orderby;
            let dir = query.dir;
            let limit = query.limit;
            let offset = query.offset;
            let cond = "";
            if (filterValue && filterValue !== undefined) {
                filterValue = filterValue.toLowerCase();
                cond = ` AND ( LOWER(contractor_number) LIKE '%${filterValue}%' OR LOWER(name1) LIKE '%${filterValue}%' OR LOWER(name2) LIKE '%${filterValue}%' OR LOWER(street) LIKE '%${filterValue}%' OR LOWER(zipcode) LIKE '%${filterValue}%' OR LOWER(phone1) LIKE '%${filterValue}%' OR LOWER(phone2) LIKE '%${filterValue}%' OR LOWER(mobile) LIKE '%${filterValue}%' OR LOWER(email) LIKE '%${filterValue}%'  ) `;
            }
            if (dir == undefined)
                dir = "ASC";
            let orderBySql = orderby
                ? ` ORDER BY ${orderby} ${dir}`
                : ` ORDER BY created_time DESC `;
            const contractorcountQry = "SELECT count(*) AS total_count FROM contractors WHERE status = 1 " +
                cond;
            const totalLenResp = yield db_1.db.selectRow(contractorcountQry);
            const recordsTotal = totalLenResp.total_count;
            let contractorQry = "SELECT contractorId, contractor_number, name1 AS name FROM contractors WHERE status = 1 " +
                cond;
            contractorQry += orderBySql;
            contractorQry += limit ? ` LIMIT ${limit}` : ` LIMIT ${recordsTotal}`;
            offset && (contractorQry += ` OFFSET ${offset}`);
            const contractorResult = yield db_1.db.select(contractorQry);
            const result = {
                status: "ok",
                recordsTotal: recordsTotal,
                data: contractorResult
            };
            return result;
        });
    }
    addedit(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = req.body;
            const basicData = JSON.parse(formData.basicData);
            let contractorId = basicData.contractorId;
            contractorId = contractorId > 0 ? contractorId : 0;
            let result;
            this.user = req.user;
            if (contractorId > 0) {
                result = yield this.editInformation(contractorId, formData);
                yield historyService_1.historyServiceObj.logHistory(req.user, `updated the contractor ${contractorId}`, "contractor", contractorId);
                return result;
            }
            else {
                result = yield this.addInformation(formData);
                yield historyService_1.historyServiceObj.logHistory(req.user, `created the contractor ${result.newContractorId}`, "contractor", result.newContractorId);
                return result;
            }
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
                const insertQry = `INSERT INTO contractors SET ?`;
                let insertData = {
                    contractor_number: basicData.contractor_number,
                    alias: basicData.alias,
                    name1: basicData.name1,
                    name2: basicData.name2,
                    street: basicData.street,
                    zipcode: basicData.zipcode,
                    city: basicData.city,
                    phone1: basicData.phone1,
                    fax: basicData.fax,
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
                    commercial_date: basicData.commercial_date,
                    currency: basicData.currency,
                    contract_ok: basicData.contract_ok,
                    payment_block: basicData.payment_block,
                    payment_stop: basicData.payment_stop,
                    bankaccount_liquidator: basicData.bankaccount_liquidator,
                    account_holder: basicData.account_holder,
                    payment_stop_iban: basicData.payment_stop_iban,
                    payment_stop_bic: basicData.payment_stop_bic,
                    payment_stop_bank_name: basicData.payment_stop_bank_name,
                    comment: comment,
                    debitor_no: basicData.debitor_no,
                    creditor_no: basicData.creditor_no,
                    created_time: current_time,
                    updated_time: current_time,
                    bank1Id: basicData.bank1Id,
                    bank2Id: basicData.bank2Id,
                    locationId
                };
                if (contractFiles_name !== undefined && contractFiles_name !== null) {
                    insertData["contract_file"] = contractFiles_name;
                }
                const contractorResp = yield db_1.db.insert(insertQry, insertData);
                const contractorId = contractorResp.insertId;
                if (basicData.mobiles) {
                    const qry = "INSERT INTO contractor_mobile (`contractorId`, `mobile`, `order`) VALUES ?";
                    const mobiles = basicData.mobiles.map((x, i) => {
                        return [contractorId, x, i];
                    });
                    yield db_1.db.insert(qry, mobiles);
                }
                if (personList && personList.length > 0) {
                    const insertPersonQry = `INSERT INTO contractors_contact_person (contractorId, personId, added_date) VALUES ?`;
                    let insertPersonData = [];
                    try {
                        for (var personList_1 = __asyncValues(personList), personList_1_1; personList_1_1 = yield personList_1.next(), !personList_1_1.done;) {
                            const perId = personList_1_1.value;
                            if (perId > 0) {
                                insertPersonData.push([contractorId, perId, current_time]);
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
                    const insertToutsonQry = `INSERT INTO contractors_order(contractorId, orderId, added_date) VALUES ?`;
                    let insertToutsonData = [];
                    try {
                        for (var orderDataList_1 = __asyncValues(orderDataList), orderDataList_1_1; orderDataList_1_1 = yield orderDataList_1.next(), !orderDataList_1_1.done;) {
                            const orderId = orderDataList_1_1.value;
                            insertToutsonData.push([contractorId, orderId, current_time]);
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
                            contractorId,
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
                this.response.newContractorId = contractorId;
                this.response.message = "contractor has been inserted successfully.";
                return this.response;
            }
            catch (e) {
                throw e;
            }
        });
    }
    editInformation(contractorId, formData) {
        var e_3, _a, e_4, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const basicData = JSON.parse(formData.basicData);
            const personList = formData.personList != "[]" ? JSON.parse(formData.personList) : [];
            const deleteContractorPersons = formData.deleteContractorPersons != "[]"
                ? JSON.parse(formData.deleteContractorPersons)
                : [];
            const comment = formData.comment;
            const orderDataList = formData.orderDataList != "[]" ? JSON.parse(formData.orderDataList) : [];
            const deleteContractorOrders = formData.deleteContractorOrders != "[]"
                ? JSON.parse(formData.deleteContractorOrders)
                : [];
            const priceHistory = formData.priceHistory !== "[]" ? JSON.parse(formData.priceHistory) : [];
            let contractFiles_name = formData.contractFiles_name;
            let now = new Date();
            let current_time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
            let ustr_mandatory = basicData.ustr_mandatory ? 1 : 0;
            const contractorQry = "SELECT * FROM contractors WHERE contractorId = ?";
            const contractor = yield db_1.db.selectRow(contractorQry, [contractorId]);
            if (!contractor) {
                return {
                    status: "error",
                    message: "Item not found"
                };
            }
            let locationId = null;
            let qry = "";
            if (basicData.location) {
                if (contractor.locationId) {
                    qry = `UPDATE locations SET ? WHERE id = ${contractor.locationId}`;
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
                    locationId = contractor.locationId;
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
            const insertQry = `UPDATE contractors SET ? WHERE contractorId = ${contractorId}`;
            let insertData = {
                contractor_number: basicData.contractor_number,
                alias: basicData.alias,
                name1: basicData.name1,
                name2: basicData.name2,
                street: basicData.street,
                zipcode: basicData.zipcode,
                city: basicData.city,
                phone1: basicData.phone1,
                fax: basicData.fax,
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
                commercial_date: basicData.commercial_date,
                currency: basicData.currency,
                contract_ok: basicData.contract_ok,
                payment_block: basicData.payment_block,
                payment_stop: basicData.payment_stop,
                bankaccount_liquidator: basicData.bankaccount_liquidator,
                account_holder: basicData.account_holder,
                payment_stop_iban: basicData.payment_stop_iban,
                payment_stop_bic: basicData.payment_stop_bic,
                payment_stop_bank_name: basicData.payment_stop_bank_name,
                comment: comment,
                debitor_no: basicData.debitor_no,
                creditor_no: basicData.creditor_no,
                updated_time: current_time,
                bank1Id: basicData.bank1Id,
                bank2Id: basicData.bank2Id,
                locationId
            };
            if (contractFiles_name !== undefined && contractFiles_name !== null) {
                insertData["contract_file"] = contractFiles_name;
            }
            historyService_1.historyServiceObj.logHistory(this.user, `updated the contractor ${contractorId}`, "contractor", contractorId);
            yield db_1.db.update(insertQry, insertData);
            qry = ` DELETE FROM contractor_mobile WHERE contractorId = ${contractorId} `;
            yield db_1.db.delete(qry);
            if (basicData.mobiles) {
                qry =
                    "INSERT INTO contractor_mobile (`contractorId`, `mobile`, `order`) VALUES ?";
                const mobiles = basicData.mobiles.map((x, i) => {
                    return [contractorId, x, i];
                });
                yield db_1.db.insert(qry, mobiles);
            }
            if (deleteContractorPersons && deleteContractorPersons.length > 0) {
                let dpIds = deleteContractorPersons.join();
                const deletecpQry = ` DELETE FROM contractors_contact_person WHERE contractorId = ${contractorId} AND personId IN (${dpIds})`;
                yield db_1.db.delete(deletecpQry);
                historyService_1.historyServiceObj.logHistory(this.user, `deleted some of the contractor ${contractorId} s' contact persons`, "contractor", contractorId);
            }
            if (personList && personList.length > 0) {
                const insertPersonQry = `INSERT INTO contractors_contact_person (contractorId, personId, added_date) VALUES ?`;
                let insertPersonData = [];
                try {
                    for (var personList_2 = __asyncValues(personList), personList_2_1; personList_2_1 = yield personList_2.next(), !personList_2_1.done;) {
                        const perId = personList_2_1.value;
                        if (perId > 0) {
                            insertPersonData.push([contractorId, perId, current_time]);
                            const upClient = ` UPDATE persons SET status = 1 WHERE personId = ${perId}`;
                            yield db_1.db.update(upClient);
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
                historyService_1.historyServiceObj.logHistory(this.user, `added some of the contractor ${contractorId} s' contact persons`, "contractor", contractorId);
            }
            if (deleteContractorOrders && deleteContractorOrders.length > 0) {
                let doIds = deleteContractorOrders.join();
                const deleteTourQry = ` DELETE FROM contractors_order WHERE contractorId = ${contractorId} AND orderId IN (${doIds}) `;
                yield db_1.db.delete(deleteTourQry);
                historyService_1.historyServiceObj.logHistory(this.user, `deleted some of the contractor ${contractorId}'s orders`, "contractor", contractorId);
            }
            if (orderDataList && orderDataList.length > 0) {
                const insertToutsonQry = `INSERT INTO contractors_order(contractorId, orderId, added_date) VALUES ?`;
                let insertToutsonData = [];
                try {
                    for (var orderDataList_2 = __asyncValues(orderDataList), orderDataList_2_1; orderDataList_2_1 = yield orderDataList_2.next(), !orderDataList_2_1.done;) {
                        const orderId = orderDataList_2_1.value;
                        insertToutsonData.push([contractorId, orderId, current_time]);
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
                historyService_1.historyServiceObj.logHistory(this.user, `added some of the contractor ${contractorId}'s orders`, "contractor", contractorId);
            }
            if (priceHistory && priceHistory.length > 0) {
                let history = priceHistory.map((x) => {
                    return [
                        x.orderId,
                        contractorId,
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
            this.response.message = "contractor Has been updated successfully.";
            return this.response;
        });
    }
    getContractorDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultData = {};
            let contractorId = parseInt(data.contractorId);
            const contractorQry = `SELECT ct.*, b1.name AS bank1_name, b2.name AS bank2_name
                          FROM contractors AS ct
                          LEFT JOIN locations ON locations.id = ct.locationId
                          LEFT JOIN banks AS b1 ON b1.bankId = ct.bank1Id
                          LEFT JOIN banks AS b2 ON b2.bankId = ct.bank2Id
                          WHERE contractorId = ?`;
            let contractorResult = yield db_1.db.selectRow(contractorQry, [contractorId]);
            const qry = "SELECT * FROM contractor_mobile WHERE contractorId = ? ORDER BY `order`";
            let mobiles = yield db_1.db.select(qry, [contractorId]);
            mobiles = mobiles.map((x) => x.mobile);
            const location = {
                lat: contractorResult.lat,
                lng: contractorResult.lng,
                zoom: contractorResult.zoom,
                address: contractorResult.address,
                marker: {
                    lat: contractorResult.marker_lat,
                    lng: contractorResult.marker_lng,
                    draggable: contractorResult.marker_draggable
                }
            };
            delete contractorResult.lat;
            delete contractorResult.lng;
            delete contractorResult.marker_lat;
            delete contractorResult.marker_lng;
            delete contractorResult.marker_draggable;
            delete contractorResult.zoom;
            delete contractorResult.address;
            contractorResult = Object.assign(Object.assign({}, contractorResult), { location, mobiles });
            const contctPersonQry = "SELECT * FROM contractors_contact_person WHERE  contractorId = ? ";
            const contctPersonResult = yield db_1.db.select(contctPersonQry, [contractorId]);
            const tourQry = `SELECT *
                    FROM contractors_order
                    JOIN orders ON orders.orderId  = contractors_order.orderId
                    WHERE orders.special_type = 0 AND contractorId = ? `;
            const tourResult = yield db_1.db.select(tourQry, [contractorId]);
            const specialtourQry = `SELECT *
                            FROM contractors_order
                            JOIN orders ON orders.orderId  = contractors_order.orderId
                            WHERE orders.special_type = 1 AND contractorId = ? `;
            const specialtourResult = yield db_1.db.select(specialtourQry, [contractorId]);
            resultData.basicData = contractorResult;
            resultData.personIdsList = contctPersonResult;
            resultData.tourList = tourResult;
            resultData.specialtourData = specialtourResult;
            this.response.status = "ok";
            this.response.data = resultData;
            return this.response;
        });
    }
    deleteContractor(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultData = {};
            let contractorId = parseInt(data.contractorId);
            const deletecontractorQry = ` DELETE FROM contractors WHERE contractorId = ${contractorId} `;
            yield db_1.db.delete(deletecontractorQry);
            const deletecpQry = ` DELETE FROM contractors_contact_person WHERE contractorId = ${contractorId} `;
            yield db_1.db.delete(deletecpQry);
            const deleteTourQry = ` DELETE FROM contractors_tour WHERE contractorId = ${contractorId} `;
            yield db_1.db.delete(deleteTourQry);
            const deleteOrderQry = ` DELETE FROM contractors_order WHERE contractorId = ${contractorId} `;
            yield db_1.db.delete(deleteOrderQry);
            const deleteSpecialTourQry = ` DELETE FROM contractors_special_order WHERE contractorId = ${contractorId} `;
            yield db_1.db.delete(deleteSpecialTourQry);
            const deleteMobile = ` DELETE FROM contractor_mobile WHERE contractorId = ${contractorId} `;
            yield db_1.db.delete(deleteMobile);
            this.response.status = "ok";
            this.response.message = "contractor Has been deleted successfully.";
            return this.response;
        });
    }
    getNewContractorNo() {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let newcontractorId = 0;
            const contractorQry = "SELECT contractorId FROM contractors ORDER BY contractorId DESC LIMIT 1  ";
            const contractorResult = yield db_1.db.selectRow(contractorQry);
            if (contractorResult && contractorResult.contractorId > 0) {
                newcontractorId = parseInt(contractorResult.contractorId);
            }
            newcontractorId = newcontractorId + 1;
            this.response.status = "ok";
            this.response.newcontractorId = newcontractorId;
            return this.response;
        });
    }
    contractorPersonList(request) {
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
            let contractorId = 0;
            let newPersonIds = [];
            let deletedPersonIds = [];
            if (search) {
                filterValue = search.value;
                contractorId = search.contractorId;
                newPersonIds = search.newPersonIds;
                deletedPersonIds = search.deletedPersonIds;
            }
            contractorId =
                contractorId &&
                    contractorId !== undefined &&
                    contractorId !== null &&
                    contractorId > 0
                    ? contractorId
                    : 0;
            let cond = "";
            if (newPersonIds && newPersonIds.length > 0) {
                let newPIds = newPersonIds.join();
                if (contractorId > 0)
                    cond += ` AND ( (CCP.contractorId = ${contractorId} AND P.status = 1) OR P.personId IN(${newPIds}) )`;
                else
                    cond += ` AND ( P.personId IN(${newPIds}))`;
            }
            else {
                cond += ` AND CCP.contractorId = ${contractorId} AND P.status = 1`;
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
                }
                else if (column == 1) {
                    orderby = " P.salutation ";
                }
                else if (column == 2) {
                    orderby = " P.first_name ";
                }
                else if (column == 3) {
                    orderby = " P.surname ";
                }
                else if (column == 4) {
                    orderby = " P.phone ";
                }
                else if (column == 5) {
                    orderby = " P.email ";
                }
                orderby += dir;
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
            const personcountQry = "SELECT count(*) AS total_count FROM persons P LEFT JOIN contractors_contact_person CCP ON CCP.personId =P.personId AND CCP.contractorId = " +
                contractorId +
                "  WHERE 1=1  " +
                cond;
            const totalLenResp = yield db_1.db.selectRow(personcountQry);
            recordsTotal = totalLenResp.total_count;
            const personQry = "SELECT CCP.contractors_contact_personId,  CCP.contractorId , CCP.added_date , P.personId, P.person_number, P.salutation , P.first_name, P.surname, P.department, P.phone, P.email  FROM persons P LEFT JOIN contractors_contact_person CCP ON CCP.personId =P.personId AND CCP.contractorId = " +
                contractorId +
                "  WHERE 1=1 " +
                cond +
                orderby +
                limit;
            const personResult = yield db_1.db.select(personQry);
            this.response.status = "ok";
            this.response.draw = draw;
            this.response.recordsTotal = personResult.length;
            this.response.recordsFiltered = personResult.length;
            this.response.data = personResult;
            return this.response;
        });
    }
    deleteContractorPerson(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let req_data = request.body;
            let contractors_contact_personId = req_data.contractors_contact_personId;
            if (contractors_contact_personId > 0) {
                const deleteClientQry = ` DELETE FROM contractors_contact_person WHERE contractors_contact_personId = ${contractors_contact_personId} `;
                yield db_1.db.delete(deleteClientQry);
            }
            this.response.status = "ok";
            this.response.message = "Client person Has been deleted successfully.";
            return this.response;
        });
    }
    contractorOrderList(request) {
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
            let contractorId = 0;
            let newOrderIds = [];
            let deletedOrderIds = [];
            if (search) {
                filterValue = search.value;
                contractorId = search.contractorId;
                newOrderIds = search.newOrderIds;
                deletedOrderIds = search.deletedOrderIds;
            }
            contractorId =
                contractorId &&
                    contractorId !== undefined &&
                    contractorId !== null &&
                    contractorId > 0
                    ? contractorId
                    : 0;
            let cond = "";
            if (newOrderIds && newOrderIds.length > 0) {
                let newPIds = newOrderIds.join();
                if (contractorId > 0)
                    cond += ` AND ( (cto.contractorId = ${contractorId}) OR o.orderId IN(${newPIds}) )`;
                else
                    cond += ` AND ( o.orderId IN(${newPIds}))`;
            }
            else {
                cond += ` AND cto.contractorId = ${contractorId} `;
            }
            if (deletedOrderIds && deletedOrderIds.length > 0) {
                let doIds = deletedOrderIds.join();
                cond += ` AND o.orderId NOT IN  ( ${doIds} )`;
            }
            if (status == 1) {
                cond += " AND o.status = 1 ";
            }
            if (status == 0) {
                cond += " AND o.status = 0";
            }
            let orderby = "";
            if (order && order.length > 0) {
                let column = order[0].column;
                let dir = order[0].dir;
                if (column == 0) {
                    orderby = " o.order_number ";
                }
                else if (column == 1) {
                    orderby = " o.customer ";
                }
                else if (column == 2) {
                    orderby = " o.client_price ";
                }
                else if (column == 3) {
                    orderby = " o.price_basis ";
                }
                orderby += dir;
            }
            else {
                orderby = " cto.added_date DESC ";
            }
            orderby = "  ORDER BY " + orderby + " ";
            let limit = " LIMIT  " + start + " , " + length + " ";
            if (filterValue && filterValue !== undefined) {
                filterValue = filterValue.toLowerCase();
                cond = ` AND ( LOWER(o.order_number) LIKE '%${filterValue}%' OR LOWER(o.customer) LIKE '%${filterValue}%' OR LOWER(o.client_price) LIKE '%${filterValue}%' OR LOWER(o.price_basis)  ) `;
            }
            if (fetchMethod == 0) {
                cond += ` AND o.special_type = false `;
            }
            else if (fetchMethod == 1) {
                cond += ` AND o.special_type = true `;
            }
            const ordersQry = `SELECT   o.orderId, o.order_number, o.description, o.client_price, o.client_price_week, o.client_price_weekend, o.contractor_price, o.contractor_price_week, o.contractor_price_weekend,
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
        WHERE cto.contractorId = ${contractorId}` +
                cond +
                orderby +
                limit;
            const orderResult = yield db_1.db.select(ordersQry);
            const qry = "SELECT * FROM client_account_manager GROUP BY clientId ORDER BY `order`";
            let accountManagerResult = yield db_1.db.select(qry);
            let account_managers = [];
            let tmp = [], i = 0;
            for (i = 0; i < accountManagerResult.length; i++) {
                if (i > 0 &&
                    accountManagerResult[i - 1].clientId != accountManagerResult[i].clientId) {
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
            for (i = 0; i < orderResult.length; i++) {
                if (orderResult[i].clientId &&
                    account_managers[orderResult[i].clientId]) {
                    orderResult[i] = Object.assign(Object.assign({}, orderResult[i]), { account_managers: account_managers[orderResult[i].clientId] });
                }
            }
            this.response.status = "ok";
            this.response.draw = draw;
            this.response.recordsTotal = orderResult.length;
            this.response.recordsFiltered = orderResult.length;
            this.response.data = orderResult;
            return this.response;
        });
    }
    deleteContractorOrder(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.response = {};
            let req_data = request.body;
            let contractors_orderId = req_data.contractors_orderId;
            if (contractors_orderId > 0) {
                const deleteClientQry = ` DELETE FROM contractors_order WHERE contractors_orderId = ${contractors_orderId} `;
                yield db_1.db.delete(deleteClientQry);
            }
            this.response.status = "ok";
            this.response.message = "Client Order has been deleted successfully.";
            return this.response;
        });
    }
    addOpenItem(feeds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let qry = "INSERT INTO contractor_open_items SET ?";
                let item = {
                    contractorId: feeds.contractorId,
                    companyId: feeds.companyId,
                    order_type: feeds.order_type,
                    description: feeds.description,
                    amount: feeds.amount,
                    unit: feeds.unit,
                    price: feeds.price
                };
                const result = yield db_1.db.insert(qry, item);
                return {
                    status: "ok",
                    newOpenItemId: result.insertId
                };
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.contractorModelObj = new contractorModel();
