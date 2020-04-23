"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
class Connection {
    constructor() {
        let mysql = require('mysql');
        let connection = mysql.createConnection({
            host: config_1.default.db.host,
            user: config_1.default.db.user,
            password: config_1.default.db.password,
            database: config_1.default.db.database,
            port: config_1.default.db.port,
        });
        return this.connectDB(connection);
    }
    connectDB(connection) {
        connection.connect(function (err) {
            if (err) {
                return console.error('error: ' + err.message);
            }
            console.log('Connected to the MySQL server.');
        });
        return connection;
    }
}
exports.conn = new Connection();
