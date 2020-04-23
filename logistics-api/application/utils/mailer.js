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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../utils/config"));
const transporter = nodemailer_1.default.createTransport({
    host: config_1.default.mailer.options.service,
    port: 587,
    secure: false,
    auth: {
        user: config_1.default.mailer.options.auth.user,
        pass: config_1.default.mailer.options.auth.pass
    }
});
exports.sendInvoiceMail = function (to) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const info = yield transporter.sendMail({
                from: config_1.default.mailer.from,
                to,
                subject: "Confirm your invoice",
                text: "Confirm your invoice",
                html: '<b>Confirm your invoice</b>'
            });
            console.log(info);
            return info;
        }
        catch (e) {
            throw e;
        }
    });
};
exports.ok = function () {
    console.log("here");
};
