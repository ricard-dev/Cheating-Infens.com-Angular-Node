import { invoiceModelObj } from "../models/invoiceModel";

exports.getInvoiceList = async function(req: any, res: any) {
    var result : any = await invoiceModelObj.getInvoiceList(req);
    res.send(result);
}

exports.getClientInvoices = async function(req : any, res : any) {
    var result : any = await invoiceModelObj.getClientInvoices(req);
    res.send(result);
}

exports.getContractorInvoices = async function(req : any, res : any) {
    var result : any = await invoiceModelObj.getContractorInvoices(req);
    res.send(result);
}

exports.getInvoiceItems = async function(req: any, res : any) {
    var result : any = await invoiceModelObj.getInvoiceItems(req);
    res.send(result);
}