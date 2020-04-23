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
const companyModel_1 = require("../models/companyModel");
var url = require("url");
exports.addedit = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.file !== undefined) {
                req.body.logoFile = req.file.location;
            }
            let result = yield companyModel_1.companyModelObj.addedit(req);
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
            res.status(400).send({ status: "error", message: e.message });
        }
    });
};
exports.getCompanyList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var result = yield companyModel_1.companyModelObj.getCompanyList(req);
        res.send(result);
    });
};
exports.getCompanyDetails = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var url_parts = url.parse(req.url, true);
        var reddata = url_parts.query;
        var result = yield companyModel_1.companyModelObj.getCompanyDetails(reddata);
        res.send(result);
    });
};
exports.deleteCompany = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var url_parts = url.parse(req.url, true);
        var reddata = url_parts.query;
        var result = yield companyModel_1.companyModelObj.deleteCompany(reddata);
        res.send(result);
    });
};
exports.getNewCompanyNo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var result = yield companyModel_1.companyModelObj.getNewCompanyNo(req);
        res.send(result);
    });
};
