import { testModelObj } from "../models/testModel";
import { testModel2Obj } from "../models/testM2";

exports.get = async  function(req : any, res : any){
    //access the function
    var result : any = await testModelObj.get();
    res.render('index', { title: result[0].name });
}




 