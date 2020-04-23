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
const connection_1 = require("../utils/connection");
class DB {
    select(query, param) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (param && param.length > 0) {
                    connection_1.conn.query(query, param, function (err, result, fields) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                }
                else {
                    connection_1.conn.query(query, function (err, result, fields) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                }
            });
        });
    }
    selectRow(query, param) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (param && param.length > 0) {
                    connection_1.conn.query(query, param, function (err, result, fields) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (result.length == 0) {
                            resolve({});
                        }
                        else if (result && result.length == 1) {
                            resolve(result[0]);
                        }
                        else {
                            resolve({ 'status': 'error', 'message': 'Query has multiple records.' });
                        }
                    });
                }
                else {
                    connection_1.conn.query(query, function (err, result, fields) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (result.length == 0) {
                            resolve({});
                        }
                        else if (result && result.length == 1) {
                            resolve(result[0]);
                        }
                        else {
                            resolve({ 'status': 'error', 'message': 'Query has multiple records.' });
                        }
                    });
                }
            });
        });
    }
    insert(query, param) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (param && Array.isArray(param) && param.length > 0) {
                    connection_1.conn.query(query, [param], function (err, result) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                }
                else if (typeof param === 'object') {
                    connection_1.conn.query(query, param, function (err, result) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                }
                else {
                    connection_1.conn.query(query, function (err, result) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                }
            });
        });
    }
    insert_multi(query, param) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (param && param.length > 0) {
                    connection_1.conn.query(query, [param], function (err, result) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                }
                else {
                    throw "Invalide Query";
                }
            });
        });
    }
    update(query, param) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (param && Array.isArray(param) && param.length > 0) {
                    connection_1.conn.query(query, [param], function (err, result) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                }
                else if (typeof param === 'object') {
                    connection_1.conn.query(query, param, function (err, result) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                }
                else {
                    connection_1.conn.query(query, function (err, result) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                }
            });
        });
    }
    delete(query, param) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (param && param.length > 0) {
                    connection_1.conn.query(query, [param], function (err, result) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                }
                else {
                    connection_1.conn.query(query, function (err, result) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                }
            });
        });
    }
}
exports.db = new DB();
