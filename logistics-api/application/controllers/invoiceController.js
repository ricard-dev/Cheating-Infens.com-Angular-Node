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
const invoiceModel_1 = require("../models/invoiceModel");
exports.getInvoiceList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var result = yield invoiceModel_1.invoiceModelObj.getInvoiceList(req);
        res.send(result);
    });
};
exports.getClientInvoices = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var result = yield invoiceModel_1.invoiceModelObj.getClientInvoices(req);
        res.send(result);
    });
};
exports.getContractorInvoices = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var result = yield invoiceModel_1.invoiceModelObj.getContractorInvoices(req);
        res.send(result);
    });
};
exports.getInvoiceItems = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var result = yield invoiceModel_1.invoiceModelObj.getInvoiceItems(req);
        res.send(result);
    });
};
