import { orderModelObj } from "../models/orderModel";
import { invoiceServiceObj } from "../services/invoiceService";
var url = require("url");
exports.addedit = async function(req: any, res: any) {
  //access the function
  try {
    var result: any = await orderModelObj.addedit(req);
    if (req.no_customer_invoice != "" && req.no_customer_invoice) {
      // invoiceServiceObj.create();
    }
    res.send(result);
  } catch (e) {
    res.status(422).send({
      message: e.message
    });
  }
};

exports.getOrderList = async function(req: any, res: any) {
  //access the function
  var result: any = await orderModelObj.getOrderList(req);

  res.send(result);
};

exports.getOpenPositions = async function(req: any, res: any) {
  const result: any = await orderModelObj.getOpenPositions(req.body);
  res.send(result);
};

exports.getOrderDetails = async function(req: any, res: any) {
  //access the function
  try {
    var url_parts = url.parse(req.url, true);
    var reddata = url_parts.query;

    var result: any = await orderModelObj.getOrderDetails(reddata);

    res.send(result);
  } catch (e) {
    res.status(500).send({ message: "something went wrong" });
  }
};

exports.deleteOrder = async function(req: any, res: any) {
  //access the function
  var url_parts = url.parse(req.url, true);
  var reddata = url_parts.query;

  var result: any = await orderModelObj.deleteOrder(reddata);

  res.send(result);
};

exports.getNewOrderNo = async function(req: any, res: any) {
  //access the function
  var result: any = await orderModelObj.getNewOrderNo(req);

  res.send(result);
};

exports.savePriceHisotry = async function(req: any, res: any) {
  try {
    const result = await orderModelObj.savePriceHistory(req.body);
    res.send({ status: "ok", message: "saved" });
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
};

exports.getPriceHistory = async function(req: any, res: any) {
  try {
    const result = await orderModelObj.getPriceHistory(
      req.query.orderId,
      req.query.entityId,
      req.query.priceType
    );
    res.send({ status: "ok", data: result });
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
};
