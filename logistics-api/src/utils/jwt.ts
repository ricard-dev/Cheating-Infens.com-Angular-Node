const expressJwt = require('express-jwt');
import config from "../utils/config";

module.exports = jwt;
function jwt() {
    const { apiSecret } = config;
    return expressJwt({ secret: config.apiSecret }).unless({ path: ['/api/login', '/getStateList'] });
}
