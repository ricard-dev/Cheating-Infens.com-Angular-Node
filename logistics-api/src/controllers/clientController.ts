import { clientModelObj } from "../models/clientModel";
const url = require("url");
exports.addedit = async function(req: any, res: any) {
  //access the function
  if (req.file !== undefined) req.body.contractFiles_name = req.file.location;

  const result: any = await clientModelObj.addedit(req);

  let data = {
    ...result
  };

  if (req.file !== undefined) {
    data["uploadedFile"] = req.file.location;
    data["fileName"] = req.file.originalname;
    data["fileKeyName"] = req.file.key;
  }
  res.send(data);
};

exports.getClientList = async function(req: any, res: any) {
  //access the function
  const result: any = await clientModelObj.getClientList(req);
  res.send(result);
};

exports.getClientDetails = async function(req: any, res: any) {
  //access the function
  const url_parts = url.parse(req.url, true);
  const reddata = url_parts.query;

  const result: any = await clientModelObj.getClientDetails(reddata);
  res.send(result);
};

exports.deleteClient = async function(req: any, res: any) {
  //access the function
  const url_parts = url.parse(req.url, true);
  const reddata = url_parts.query;

  const result: any = await clientModelObj.deleteClient(reddata);

  res.send(result);
};

exports.getNewClientNo = async function(req: any, res: any) {
  //access the function
  const result: any = await clientModelObj.getNewClientNo(req);
  res.send(result);
};

exports.clientPersonList = async function(req: any, res: any) {
  //access the function
  const result: any = await clientModelObj.clientPersonList(req);
  res.send(result);
};

exports.deleteClientPerson = async function(req: any, res: any) {
  //access the function
  const result: any = await clientModelObj.deleteClientPerson(req);
  res.send(result);
};

exports.clientOrderList = async function(req: any, res: any) {
  //access the function
  const result: any = await clientModelObj.clientOrderList(req);
  res.send(result);
};

exports.deleteClientOrder = async function(req: any, res: any) {
  //access the function
  const result: any = await clientModelObj.deleteClientOrder(req);
  res.send(result);
};

exports.getPriceList = async function(req: any, res: any) {
  const result = await clientModelObj.getPriceList(req.query.clientId);
  res.send(result);
};

exports.getAccountManagers = async function(req: any, res: any) {
  try {
    const result = await clientModelObj.getAccountManagers(req.query.clientId);
    res.send(result);
  } catch (e) {
    res.status(500).end();
  }
};
