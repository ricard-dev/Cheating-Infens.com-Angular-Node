import { articleModelObj } from "../models/articleModel";
var url = require('url');
exports.addedit = async  function(req : any, res : any){
    //access the function
    var result : any = await articleModelObj.addedit(req);

    res.send(result);
}

exports.getArticleList = async  function(req : any, res : any){
    //access the function
    var result : any = await articleModelObj.getArticleList(req);
    
    res.send(result);
}

exports.getArticleDetails = async  function(req : any, res : any){
    //access the function
    var url_parts = url.parse(req.url, true);
    var reddata = url_parts.query;

    var result : any = await articleModelObj.getArticleDetails(reddata);
    
    res.send(result);
}


exports.deleteArticle = async  function(req : any, res : any){
    //access the function
    var url_parts = url.parse(req.url, true);
    var reddata = url_parts.query;

    var result : any = await articleModelObj.deleteArticle(reddata);
    
    res.send(result);
}

exports.getNewArticleNo = async  function(req : any, res : any){
    //access the function
    var result : any = await articleModelObj.getNewArticleNo(req);

    res.send(result);
}

