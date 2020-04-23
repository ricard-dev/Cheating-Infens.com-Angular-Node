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
const clientModel_1 = require("../models/clientModel");
const url = require("url");
exports.addedit = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        if (req.file !== undefined)
            req.body.contractFiles_name = req.file.location;
        const result = yield clientModel_1.clientModelObj.addedit(req);
        let data = Object.assign({}, result);
        if (req.file !== undefined) {
            data["uploadedFile"] = req.file.location;
            data["fileName"] = req.file.originalname;
            data["fileKeyName"] = req.file.key;
        }
        res.send(data);
    });
};
exports.getClientList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        const result = yield clientModel_1.clientModelObj.getClientList(req);
        res.send(result);
    });
};
exports.getClientDetails = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        const url_parts = url.parse(req.url, true);
        const reddata = url_parts.query;
        const result = yield clientModel_1.clientModelObj.getClientDetails(reddata);
        res.send(result);
    });
};
exports.deleteClient = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        const url_parts = url.parse(req.url, true);
        const reddata = url_parts.query;
        const result = yield clientModel_1.clientModelObj.deleteClient(reddata);
        res.send(result);
    });
};
exports.getNewClientNo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        const result = yield clientModel_1.clientModelObj.getNewClientNo(req);
        res.send(result);
    });
};
exports.clientPersonList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        const result = yield clientModel_1.clientModelObj.clientPersonList(req);
        res.send(result);
    });
};
exports.deleteClientPerson = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        const result = yield clientModel_1.clientModelObj.deleteClientPerson(req);
        res.send(result);
    });
};
exports.clientOrderList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        const result = yield clientModel_1.clientModelObj.clientOrderList(req);
        res.send(result);
    });
};
exports.deleteClientOrder = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        const result = yield clientModel_1.clientModelObj.deleteClientOrder(req);
        res.send(result);
    });
};
exports.getPriceList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield clientModel_1.clientModelObj.getPriceList(req.query.clientId);
        res.send(result);
    });
};
exports.getAccountManagers = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield clientModel_1.clientModelObj.getAccountManagers(req.query.clientId);
            res.send(result);
        }
        catch (e) {
            res.status(500).end();
        }
    });
};
