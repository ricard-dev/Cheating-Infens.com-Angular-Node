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
const bankModel_1 = require("../models/bankModel");
exports.addBank = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield bankModel_1.bankModelObj.addBank(req.body);
        res.status(201).send(result);
    });
};
exports.updateBank = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield bankModel_1.bankModelObj.updateBank(req.params.bankId, req.body);
        if (result.affectedRows == 0) {
            res.status(404).send({
                message: "The item does not exist"
            });
        }
        else {
            res.status(200).send({
                message: "The bank was updated successfully"
            });
        }
    });
};
exports.getBanks = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield bankModel_1.bankModelObj.getBanks(req);
            res.send(result);
        }
        catch (e) {
            res.status(500).send({ status: false, message: e.message });
        }
    });
};
exports.getCompanyBanks = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield bankModel_1.bankModelObj.getCompanyBanks(req);
            res.send(result);
        }
        catch (e) {
            res.status(500).send({ status: false, message: e.message });
        }
    });
};
exports.getBank = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield bankModel_1.bankModelObj.getBank(req.params.bankId);
        if (isEmpty(result)) {
            res.status(404).send({
                message: "The bank does not exist"
            });
        }
        else {
            res.send(result);
        }
    });
};
exports.deleteBank = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield bankModel_1.bankModelObj.deleteBank(req.params.bankId);
        if (result.affectedRows == 1) {
            res.status(200).send({
                message: "The bank was deleted successfully"
            });
        }
        else {
            res.status(404).send({
                message: "The bank does not exist"
            });
        }
    });
};
exports.getNewBankId = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield bankModel_1.bankModelObj.getNewBankId(req);
            res.send(result);
        }
        catch (e) {
            res.status(500).send({ status: "error", message: e.message });
        }
    });
};
function isEmpty(myObject) {
    for (let key in myObject) {
        if (myObject.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}
