var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var testController = require('../application/controllers/test');

router.get('/get',bodyParser.json(), testController.get);

module.exports = router;
