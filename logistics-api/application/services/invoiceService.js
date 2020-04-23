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
const db_1 = require("../utils/db");
const mailer = require('../utils/mailer');
class invoiceService {
    create(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             *  TODO
             *  Invoice create then emailing
             *  */
            const Sql = `SELECT c.email
                    FROM orders AS o
                    JOIN clients_order AS co ON co.orderId = o.orderId
                    JOIN clints AS c ON c.clientId = co.clientId
                    WHERE o.orderId = ${orderId} `;
            const clientEmail = yield db_1.db.select(Sql);
            try {
                mailer.sendInvoiceMail(clientEmail);
                return {
                    status: 200,
                    message: 'Email sent'
                };
            }
            catch (e) {
                return {
                    status: 520,
                    message: 'Email can not send'
                };
            }
        });
    }
}
exports.invoiceServiceObj = new invoiceService();
