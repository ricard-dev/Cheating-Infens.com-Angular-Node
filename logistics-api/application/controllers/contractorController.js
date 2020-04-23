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
const contractorModel_1 = require("../models/contractorModel");
var url = require("url");
exports.addedit = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        try {
            if (req.file !== undefined)
                req.body.contractFiles_name = req.file.location;
            var result = yield contractorModel_1.contractorModelObj.addedit(req);
            let data = Object.assign({}, result);
            if (req.file !== undefined) {
                data["uploadedFile"] = req.file.location;
                data["fileName"] = req.file.originalname;
                data["fileKeyName"] = req.file.key;
            }
            res.send(data);
        }
        catch (e) {
            console.log(e);
            res.status(500).send({ message: e.message });
        }
    });
};
exports.getContractorList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var result = yield contractorModel_1.contractorModelObj.getContractorList(req);
        res.send(result);
    });
};
exports.getContractorsForPayment = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield contractorModel_1.contractorModelObj.getContractorsForPayment(req.query);
        res.send(result);
    });
};
exports.getContractorDetails = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var url_parts = url.parse(req.url, true);
        var reddata = url_parts.query;
        var result = yield contractorModel_1.contractorModelObj.getContractorDetails(reddata);
        res.send(result);
    });
};
exports.deleteContractor = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var url_parts = url.parse(req.url, true);
        var reddata = url_parts.query;
        var result = yield contractorModel_1.contractorModelObj.deleteContractor(reddata);
        res.send(result);
    });
};
exports.getNewContractorNo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var result = yield contractorModel_1.contractorModelObj.getNewContractorNo(req);
        res.send(result);
    });
};
exports.contractorPersonList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var result = yield contractorModel_1.contractorModelObj.contractorPersonList(req);
        res.send(result);
    });
};
exports.deleteContractorPerson = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var result = yield contractorModel_1.contractorModelObj.deleteContractorPerson(req);
        res.send(result);
    });
};
exports.contractorOrderList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        try {
            var result = yield contractorModel_1.contractorModelObj.contractorOrderList(req);
            res.send(result);
        }
        catch (e) {
            res.status(400).send({ status: "error", message: e.message });
        }
    });
};
exports.deleteContractorOrder = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var result = yield contractorModel_1.contractorModelObj.deleteContractorOrder(req);
        res.send(result);
    });
};
exports.addOpenItem = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield contractorModel_1.contractorModelObj.addOpenItem(req.body);
            res.send(result);
        }
        catch (e) {
            res.status(500).send({
                status: "error",
                message: e.message
            });
        }
    });
};
