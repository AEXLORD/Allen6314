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
    var cookies = mycookies.getMyCookies(req);
    var AdminAuthorization = config.getAdminAuthorization();
	var url = config.getBackendUrlPrefix() + "auth/test";
	var options = {
        url:url,
        headers:{
            'Authorization': "Bearer " + cookies[AdminAuthorization]
        }
    }

    request(options,function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);

            if(returnData.statusCode != 0){
                logger.error("admin/index.js -- auth/test fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            } else {
                var path = "<li><a href = \"/admin/index\" class = \"active\">Index</a></li>";
                var data = {
                    'path':path
                };
                res.render('admin/index');
            }
        } else {
            logger.error("admin/index.js -- auth/test fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("admin/index.js -- auth/test fail ..." +
                    "response.statuCode = " + response.statusCode + "..." +
                    "response.body = " + response.body);
                }
            if(response.statusCode == 401){
                res.render('admin/login');
            } else {
                res.render('error/unknowerror');
            }
        }
    });
});

module.exports = router;


