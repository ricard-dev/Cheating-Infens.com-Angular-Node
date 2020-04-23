import { db } from "../utils/db";
const mailer = require('../utils/mailer')

class invoiceService {

    async create(orderId: number) {
        /**
         *  TODO
         *  Invoice create then emailing
         *  */
        const Sql = `SELECT c.email
                    FROM orders AS o
                    JOIN clients_order AS co ON co.orderId = o.orderId
                    JOIN clints AS c ON c.clientId = co.clientId
                    WHERE o.orderId = ${orderId} `;
        const clientEmail = await db.select(Sql);
        try {
            mailer.sendInvoiceMail(clientEmail);
            return {
                status: 200,
                message: 'Email sent'
            }
        } catch (e) {
            return {
                status: 520,
                message: 'Email can not send'
            }
        }
    }
}

export let invoiceServiceObj: any = new invoiceService();