import { conn } from "../utils/connection";

class DB { 

    async select(query : any , param : [] ){
        return new Promise((resolve, reject) => {

            if(param && param.length>0){                
                conn.query(query, param, function (err : any, result : any, fields : any) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve( result);
                });
            }
            else{
                conn.query(query, function (err : any, result : any, fields : any) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve( result);
                });
            }            
        });
    }

    async selectRow(query : any , param : [] ){
        return new Promise((resolve, reject) => {
            if(param && param.length>0){
                conn.query(query, param, function (err : any, result : any, fields : any) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if(result.length == 0){
                        resolve({})
                    }
                    else if(result && result.length ==1){
                        resolve( result[0]);
                    }else{
                        resolve({'status':'error' ,'message' : 'Query has multiple records.'});
                    }
                    
                });
            }
            else{
                conn.query(query, function (err : any, result : any, fields : any) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if(result.length == 0){
                        resolve({})
                    }
                    else if(result && result.length ==1){
                        resolve( result[0]);
                    }else{
                        resolve({'status':'error' ,'message' : 'Query has multiple records.'});
                    }                    
                });
            }            
        });
    }

    async insert(query : any , param : any ){
        return new Promise((resolve, reject) => {
            if(param && Array.isArray(param) && param.length>0){
                conn.query(query, [param], function (err : any, result : any) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve( result);
                });
            }
            else if(typeof param ==='object' ){
                conn.query(query, param, function (err : any, result : any) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve( result);
                });
            }
            else{
                conn.query(query, function (err : any, result : any) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve( result);
                });
            }
        });
    }


    async insert_multi(query : any , param : []){
        return new Promise((resolve, reject) => {
            if(param && param.length>0){
                conn.query(query, [param], function (err : any, result : any) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve( result);
                });
            }
            else{
                throw "Invalide Query";
            }
        });
    }

    async update(query : any , param : any ){
        return new Promise((resolve, reject) => {
            if(param && Array.isArray(param) && param.length>0){
                conn.query(query, [param], function (err : any, result : any) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve( result);
                });
            }
            else if(typeof param ==='object' ){
                conn.query(query, param, function (err : any, result : any) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve( result);
                });
            }
            else{
                conn.query(query, function (err : any, result : any) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve( result);
                });
            }
        });
    }

    async delete(query : any , param : []){
        return new Promise((resolve, reject) => {
            if(param && param.length>0){
                conn.query(query, [param], function (err : any, result : any) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve( result);
                });
            }
            else{
                conn.query(query, function (err : any,    result : any) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve( result);
                });
            }
        });
    }

}

export  let db : any = new DB();