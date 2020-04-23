import { companyModelObj } from "../models/companyModel";
var url = require("url");
exports.addedit = async function(req: any, res: any) {
  try {
    if (req.file !== undefined) {
      req.body.logoFile = req.file.location;
    }
    let result: any = await companyModelObj.addedit(req);

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
    res.status(400).send({ status: "error", message: e.message });
  }
};

exports.getCompanyList = async function(req: any, res: any) {
  var result: any = await companyModelObj.getCompanyList(req);

  res.send(result);
};

exports.getCompanyDetails = async function(req: any, res: any) {
  var url_parts = url.parse(req.url, true);
  var reddata = url_parts.query;

  var result: any = await companyModelObj.getCompanyDetails(reddata);

  res.send(result);
};

exports.deleteCompany = async function(req: any, res: any) {
  var url_parts = url.parse(req.url, true);
  var reddata = url_parts.query;

  var result: any = await companyModelObj.deleteCompany(reddata);

  res.send(result);
};

exports.getNewCompanyNo = async function(req: any, res: any) {
  var result: any = await companyModelObj.getNewCompanyNo(req);

  res.send(result);
};
