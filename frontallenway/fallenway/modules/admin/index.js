var express = require('express');
var request = require('request');

var Config = require('../../config/globalconfig.js');
var config = new Config();

var router = express.Router();

var Logger = require('../../config/logconfig.js');
var logger = new Logger().getLogger();

router.get('',function(req,res,next){
    logger.debug("admin/index.js -- /admin/index ...");

    var path = "<li><a href = \"/admin\" class = \"active\">Index</a></li>";
    var data = {
        'path':path
    };
    res.render('admin/login');
});

module.exports = router;


