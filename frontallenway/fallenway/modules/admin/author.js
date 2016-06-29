var express = require('express');
var router = express.Router();
var request = require('request');

var Config = require('../../config/globalconfig.js');
var config = new Config();

var MyCookies = require('../../config/mycookies.js');
var mycookies = new MyCookies();

var Logger = require('../../config/logconfig.js');
var logger = new Logger().getLogger();

router.get('',function(req,res,next){
    var cookies = mycookies.getMyCookies(req);
    var AdminAuthorization = config.getAdminAuthorization();
    var url = config.getBackendUrlPrefix() + "auth/admin/find-admin";

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
                logger.error("admin/author.js -- auth/admin/author fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
	        } else {
                var path = "<li><a href = \"/admin/index\">Index</a></li>" +
                "<li>Author Manage</li>";

                var data = {
                    'author':returnData.data.admin,
                    'path':path
                }
                res.render('admin/author/authorIndex',{'data':data});
            }
        } else {
            logger.error("admin/author.js -- auth/admin/author fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("admin/article.js -- auth/admin/author fail ..." +
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


