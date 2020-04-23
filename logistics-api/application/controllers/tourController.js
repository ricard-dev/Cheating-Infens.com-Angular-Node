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
const tourModel_1 = require("../models/tourModel");
var url = require('url');
exports.addedit = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var result = yield tourModel_1.tourModelObj.addedit(req);
        res.send(result);
    });
};
exports.getTourList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var result = yield tourModel_1.tourModelObj.getTourList(req);
        res.send(result);
    });
};
exports.getTourDetails = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var url_parts = url.parse(req.url, true);
        var reddata = url_parts.query;
        var result = yield tourModel_1.tourModelObj.getTourDetails(reddata);
        res.send(result);
    });
};
exports.deleteTour = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var url_parts = url.parse(req.url, true);
        var reddata = url_parts.query;
        var result = yield tourModel_1.tourModelObj.deleteTour(reddata);
        res.send(result);
    });
};
exports.getNewTourNo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var result = yield tourModel_1.tourModelObj.getNewToursNo(req);
        res.send(result);
    });
};
