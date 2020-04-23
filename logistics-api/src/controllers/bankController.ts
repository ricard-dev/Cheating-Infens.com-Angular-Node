import { bankModelObj } from "../models/bankModel";

exports.addBank = async function(req: any, res: any) {
  const result: any = await bankModelObj.addBank(req.body);
  res.status(201).send(result);
};

exports.updateBank = async function(req: any, res: any) {
  const result: any = await bankModelObj.updateBank(
    req.params.bankId,
    req.body
  );
  if (result.affectedRows == 0) {
    res.status(404).send({
      message: "The item does not exist"
    });
  } else {
    res.status(200).send({
      message: "The bank was updated successfully"
    });
  }
};

exports.getBanks = async function(req: any, res: any) {
  try {
    const result: any = await bankModelObj.getBanks(req);
    res.send(result);
  } catch (e) {
    res.status(500).send({ status: false, message: e.message });
  }
};

exports.getCompanyBanks = async function(req: any, res: any) {
  try {
    const result: any = await bankModelObj.getCompanyBanks(req);
    res.send(result);
  } catch (e) {
    res.status(500).send({ status: false, message: e.message });
  }
};

exports.getBank = async function(req: any, res: any) {
  const result: any = await bankModelObj.getBank(req.params.bankId);

  if (isEmpty(result)) {
    res.status(404).send({
      message: "The bank does not exist"
    });
  } else {
    res.send(result);
  }
};

exports.deleteBank = async function(req: any, res: any) {
  const result: any = await bankModelObj.deleteBank(req.params.bankId);
  if (result.affectedRows == 1) {
    res.status(200).send({
      message: "The bank was deleted successfully"
    });
  } else {
    res.status(404).send({
      message: "The bank does not exist"
    });
  }
};

exports.getNewBankId = async function(req: any, res: any) {
  try {
    const result: any = await bankModelObj.getNewBankId(req);
    res.send(result);
  } catch (e) {
    res.status(500).send({ status: "error", message: e.message });
  }
};

function isEmpty(myObject: Object) {
  for (let key in myObject) {
    if (myObject.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}
