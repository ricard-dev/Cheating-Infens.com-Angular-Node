import { userModelObj } from "../models/userModel";
var url = require("url");

exports.addUser = async function(req: any, res: any) {
  try {
    let data: any = {};
    if (req.file !== undefined) {
      req.body.uploadedFile = req.file.location;
      data["uploadedFile"] = req.file.location;
      data["fileName"] = req.file.originalname;
      data["fileKeyName"] = req.file.key;
    }

    let result: any = await userModelObj.addUser(req.body);

    res.status(201).send({
      ...result,
      ...data
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: "error", message: e.message });
  }
};

exports.updateUser = async function(req: any, res: any) {
  try {
    let data: any = {};
    if (req.file !== undefined) {
      req.body.uploadedFile = req.file.location;
      data["uploadedFile"] = req.file.location;
      data["fileName"] = req.file.originalname;
      data["fileKeyName"] = req.file.key;
    }
    let result: any = await userModelObj.updateUser(
      req.params.userId,
      req.body
    );
    if (result.affectedRows == 0) {
      res.status(404).send({
        message: "The item does not exist"
      });
    } else {
      res.status(200).send({
        status: "ok",
        message: "User was updated successfully",
        ...data
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: "ok", message: e.message });
  }
};

exports.getUser = async function(req: any, res: any) {
  const result: any = await userModelObj.getUser(req.params.userId);

  if (isEmpty(result)) {
    res.status(404).send({
      message: "User does not exist"
    });
  } else {
    res.send(result);
  }
};

exports.getUsers = async function(req: any, res: any) {
  const result: any = await userModelObj.getUsers(req.query);
  res.send(result);
};

exports.getUsersList = async function(req: any, res: any) {
  try {
    const result: any = await userModelObj.getUsersList(req.body);
    res.send(result);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};
exports.deleteUser = async function(req: any, res: any) {
  try {
    const result: any = await userModelObj.deleteUser(req.params.userId);
    if (result.affectedRows == 1) {
      res.status(200).send({
        message: "The user was deleted successfully"
      });
    } else {
      res.status(404).send({
        message: "The user does not exist"
      });
    }
  } catch (e) {
    res.status(500).send({ status: "error", message: e.message });
  }
};

exports.login = async function(req: any, res: any) {
  const result: any = await userModelObj.login(req);
  res.send(result);
};

exports.getNewUserId = async function(req: any, res: any) {
  try {
    const result: any = await userModelObj.getNewUserId(req);
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
