const expressJwt = require('express-jwt');
const defaultConfig = require('../../application/utils/config');

const config = defaultConfig.default;

module.exports = jwt;
function jwt() {
    const { apiSecret } = config;
    return expressJwt({ secret: config.apiSecret }).unless({ path: ['/api/login', '/getStateList'] });
}
