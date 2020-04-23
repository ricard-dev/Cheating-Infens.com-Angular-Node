import { commonModelObj } from "../models/commonModel";
var url = require('url');
exports.getStateList = async  function(req : any, res : any){
    //access the function
    var result : any = await commonModelObj.getStateList(req);

    res.send(result);
}