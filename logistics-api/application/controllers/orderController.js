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
const orderModel_1 = require("../models/orderModel");
var url = require("url");
exports.addedit = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        try {
            var result = yield orderModel_1.orderModelObj.addedit(req);
            if (req.no_customer_invoice != "" && req.no_customer_invoice) {
                // invoiceServiceObj.create();
            }
            res.send(result);
        }
        catch (e) {
            res.status(422).send({
                message: e.message
            });
        }
    });
};
exports.getOrderList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var result = yield orderModel_1.orderModelObj.getOrderList(req);
        res.send(result);
    });
};
exports.getOpenPositions = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield orderModel_1.orderModelObj.getOpenPositions(req.body);
        res.send(result);
    });
};
exports.getOrderDetails = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        try {
            var url_parts = url.parse(req.url, true);
            var reddata = url_parts.query;
            var result = yield orderModel_1.orderModelObj.getOrderDetails(reddata);
            res.send(result);
        }
        catch (e) {
            res.status(500).send({ message: "something went wrong" });
        }
    });
};
exports.deleteOrder = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var url_parts = url.parse(req.url, true);
        var reddata = url_parts.query;
        var result = yield orderModel_1.orderModelObj.deleteOrder(reddata);
        res.send(result);
    });
};
exports.getNewOrderNo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //access the function
        var result = yield orderModel_1.orderModelObj.getNewOrderNo(req);
        res.send(result);
    });
};
exports.savePriceHisotry = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield orderModel_1.orderModelObj.savePriceHistory(req.body);
            res.send({ status: "ok", message: "saved" });
        }
        catch (e) {
            console.log(e);
            res.status(400).end();
        }
    });
};
exports.getPriceHistory = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield orderModel_1.orderModelObj.getPriceHistory(req.query.orderId, req.query.entityId, req.query.priceType);
            res.send({ status: "ok", data: result });
        }
        catch (e) {
            console.log(e);
            res.status(400).end();
        }
    });
};
