var express = require('express');
var request = require('request');

var Config = require('../../../config/globalconfig.js');
var config = new Config();

var router = express.Router();

var Logger = require('../../../config/logconfig.js');
var logger = new Logger().getLogger();

var MyCookies = require('../../../common_utils/mycookies.js');
var mycookies = new MyCookies();

router.get('',function(req,res,next){
    res.render('admin/v5/index');
});

module.exports = router;


