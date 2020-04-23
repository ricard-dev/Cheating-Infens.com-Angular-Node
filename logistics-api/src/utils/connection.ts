import config from "./config";

class Connection {     
    constructor() { 
        let mysql = require('mysql'); 
        let connection = mysql.createConnection({
            host: config.db.host,
            user: config.db.user,
            password: config.db.password,
            database: config.db.database,
            port: config.db.port,
        });  
        return this.connectDB(connection);      
    }
    
    connectDB(connection : any){
        connection.connect(function(err : any) {
            if (err) {
              return console.error('error: ' + err.message);
            }
            console.log('Connected to the MySQL server.');
                    
        });
        return connection; 
    }
 }

 export  let conn : any = new Connection();
