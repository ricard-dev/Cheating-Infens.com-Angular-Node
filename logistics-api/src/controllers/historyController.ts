import { historyModelObj } from "../models/historyModel";

var url = require('url');

exports.getHistory = async function (req: any, res: any) {
    //access the function

    var result: any = await historyModelObj.getHistoryList(req);
    res.send(result);
}
