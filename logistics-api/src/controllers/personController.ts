import { personModelObj } from "../models/personModel";
var url = require("url");
exports.addedit = async function(req: any, res: any) {
  //access the function
  var result: any = await personModelObj.addedit(req);
  res.send(result);
};

exports.getPersonList = async function(req: any, res: any) {
  //access the function
  var result: any = await personModelObj.getPersonList(req);

  res.send(result);
};

exports.getPersonDetails = async function(req: any, res: any) {
  //access the function
  var url_parts = url.parse(req.url, true);
  var reddata = url_parts.query;

  var result: any = await personModelObj.getPersonDetails(reddata);

  res.send(result);
};

exports.deletePerson = async function(req: any, res: any) {
  //access the function
  var url_parts = url.parse(req.url, true);
  var reddata = url_parts.query;

  var result: any = await personModelObj.deletePerson(reddata);

  res.send(result);
};

exports.getNewPersonNo = async function(req: any, res: any) {
  //access the function
  var result: any = await personModelObj.getNewPersonsNo(req);

  res.send(result);
};

exports.personOrderList = async function(req: any, res: any) {
  try {
    const result = await personModelObj.personOrderList(req);
    res.send(result);
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
};
