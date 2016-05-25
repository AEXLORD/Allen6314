var express = require('express');
var request = require('request');

var Config = require('../../config/globalconfig.js');
var config = new Config();

var router = express.Router();

var Logger = require('../../config/logconfig.js');
var logger = new Logger().getLogger();

var MyCookies = require('../../config/mycookies.js');
var mycookies = new MyCookies();

router.get('',function(req,res,next){
    logger.debug("admin/index.js -- /admin/index ...");

    var cookies = mycookies.getMyCookies(req);
    if(cookies['Authorization'] == 'undefined'){
 		logger.info("cookies[Authorization] == undefined......");
		res.render('admin/login');
	} else {
        var path = "<li><a href = \"/admin\" class = \"active\">Index</a></li>";
        var data = {
            'path':path
        };
        res.render('admin/index');
    }
});

module.exports = router;


