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
const userModel_1 = require("../models/userModel");
var url = require("url");
exports.addUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = {};
            if (req.file !== undefined) {
                req.body.uploadedFile = req.file.location;
                data["uploadedFile"] = req.file.location;
                data["fileName"] = req.file.originalname;
                data["fileKeyName"] = req.file.key;
            }
            let result = yield userModel_1.userModelObj.addUser(req.body);
            res.status(201).send(Object.assign(Object.assign({}, result), data));
        }
        catch (e) {
            console.log(e);
            res.status(500).send({ status: "error", message: e.message });
        }
    });
};
exports.updateUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = {};
            if (req.file !== undefined) {
                req.body.uploadedFile = req.file.location;
                data["uploadedFile"] = req.file.location;
                data["fileName"] = req.file.originalname;
                data["fileKeyName"] = req.file.key;
            }
            let result = yield userModel_1.userModelObj.updateUser(req.params.userId, req.body);
            if (result.affectedRows == 0) {
                res.status(404).send({
                    message: "The item does not exist"
                });
            }
            else {
                res.status(200).send(Object.assign({ status: "ok", message: "User was updated successfully" }, data));
            }
        }
        catch (e) {
            console.log(e);
            res.status(500).send({ status: "ok", message: e.message });
        }
    });
};
exports.getUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield userModel_1.userModelObj.getUser(req.params.userId);
        if (isEmpty(result)) {
            res.status(404).send({
                message: "User does not exist"
            });
        }
        else {
            res.send(result);
        }
    });
};
exports.getUsers = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield userModel_1.userModelObj.getUsers(req.query);
        res.send(result);
    });
};
exports.getUsersList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield userModel_1.userModelObj.getUsersList(req.body);
            res.send(result);
        }
        catch (e) {
            res.status(500).send({ message: e.message });
        }
    });
};
exports.deleteUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield userModel_1.userModelObj.deleteUser(req.params.userId);
            if (result.affectedRows == 1) {
                res.status(200).send({
                    message: "The user was deleted successfully"
                });
            }
            else {
                res.status(404).send({
                    message: "The user does not exist"
                });
            }
        }
        catch (e) {
            res.status(500).send({ status: "error", message: e.message });
        }
    });
};
exports.login = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield userModel_1.userModelObj.login(req);
        res.send(result);
    });
};
exports.getNewUserId = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield userModel_1.userModelObj.getNewUserId(req);
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
