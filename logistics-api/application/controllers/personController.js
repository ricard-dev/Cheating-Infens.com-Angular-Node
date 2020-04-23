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
const personModel_1 = require("../models/personModel");
var url = require("url");
exports.addedit = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var result = yield personModel_1.personModelObj.addedit(req);
        res.send(result);
    });
};
exports.getPersonList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var result = yield personModel_1.personModelObj.getPersonList(req);
        res.send(result);
    });
};
exports.getPersonDetails = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var url_parts = url.parse(req.url, true);
        var reddata = url_parts.query;
        var result = yield personModel_1.personModelObj.getPersonDetails(reddata);
        res.send(result);
    });
};
exports.deletePerson = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var url_parts = url.parse(req.url, true);
        var reddata = url_parts.query;
        var result = yield personModel_1.personModelObj.deletePerson(reddata);
        res.send(result);
    });
};
exports.getNewPersonNo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var result = yield personModel_1.personModelObj.getNewPersonsNo(req);
        res.send(result);
    });
};
exports.personOrderList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield personModel_1.personModelObj.personOrderList(req);
            res.send(result);
        }
        catch (e) {
            console.log(e);
            res.status(400).end();
        }
    });
};
