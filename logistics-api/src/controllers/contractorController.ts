import { contractorModelObj } from "../models/contractorModel";
var url = require("url");
exports.addedit = async function(req: any, res: any) {
  //access the function
  try {
    if (req.file !== undefined) req.body.contractFiles_name = req.file.location;

    var result: any = await contractorModelObj.addedit(req);

    let data = {
      ...result
    };
    if (req.file !== undefined) {
      data["uploadedFile"] = req.file.location;
      data["fileName"] = req.file.originalname;
      data["fileKeyName"] = req.file.key;
    }
    res.send(data);
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: e.message });
  }
};

exports.getContractorList = async function(req: any, res: any) {
  //access the function
  var result: any = await contractorModelObj.getContractorList(req);

  res.send(result);
};

exports.getContractorsForPayment = async function(req: any, res: any) {
  let result: any = await contractorModelObj.getContractorsForPayment(
    req.query
  );
  res.send(result);
};

exports.getContractorDetails = async function(req: any, res: any) {
  //access the function
  var url_parts = url.parse(req.url, true);
  var reddata = url_parts.query;

  var result: any = await contractorModelObj.getContractorDetails(reddata);

  res.send(result);
};

exports.deleteContractor = async function(req: any, res: any) {
  //access the function
  var url_parts = url.parse(req.url, true);
  var reddata = url_parts.query;

  var result: any = await contractorModelObj.deleteContractor(reddata);

  res.send(result);
};

exports.getNewContractorNo = async function(req: any, res: any) {
  //access the function
  var result: any = await contractorModelObj.getNewContractorNo(req);

  res.send(result);
};

exports.contractorPersonList = async function(req: any, res: any) {
  //access the function
  var result: any = await contractorModelObj.contractorPersonList(req);

  res.send(result);
};

exports.deleteContractorPerson = async function(req: any, res: any) {
  //access the function
  var result: any = await contractorModelObj.deleteContractorPerson(req);

  res.send(result);
};

exports.contractorOrderList = async function(req: any, res: any) {
  //access the function
  try  {
    var result: any = await contractorModelObj.contractorOrderList(req);
    res.send(result);
  } catch(e) {
    res.status(400).send({status: "error", message: e.message });
  }
};

exports.deleteContractorOrder = async function(req: any, res: any) {
  //access the function
  var result: any = await contractorModelObj.deleteContractorOrder(req);

  res.send(result);
};

exports.addOpenItem = async function(req: any, res: any) {
  try {
    const result = await contractorModelObj.addOpenItem(req.body);
    res.send(result);
  } catch (e) {
    res.status(500).send({
      status: "error",
      message: e.message
    });
  }
};
