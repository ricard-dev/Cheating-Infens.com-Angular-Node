import { tourModelObj } from "../models/tourModel";
var url = require('url');
exports.addedit = async  function(req : any, res : any){
    //access the function
    var result : any = await tourModelObj.addedit(req);

    res.send(result);
}

exports.getTourList = async  function(req : any, res : any){
    //access the function
    var result : any = await tourModelObj.getTourList(req);
    
    res.send(result);
}

exports.getTourDetails = async  function(req : any, res : any){
    //access the function
    var url_parts = url.parse(req.url, true);
    var reddata = url_parts.query;

    var result : any = await tourModelObj.getTourDetails(reddata);
    
    res.send(result);
}


exports.deleteTour = async  function(req : any, res : any){
    //access the function
    var url_parts = url.parse(req.url, true);
    var reddata = url_parts.query;

    var result : any = await tourModelObj.deleteTour(reddata);
    
    res.send(result);
}

exports.getNewTourNo = async  function(req : any, res : any){
    //access the function
    var result : any = await tourModelObj.getNewToursNo(req);
    
    res.send(result);
}

