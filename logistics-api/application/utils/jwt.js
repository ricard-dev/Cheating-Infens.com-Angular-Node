"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expressJwt = require('express-jwt');
const config_1 = __importDefault(require("../utils/config"));
module.exports = jwt;
function jwt() {
    const { apiSecret } = config_1.default;
    return expressJwt({ secret: config_1.default.apiSecret }).unless({ path: ['/api/login', '/getStateList'] });
}
