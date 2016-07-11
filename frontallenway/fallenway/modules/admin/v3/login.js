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
    res.render('admin/v4/login.html');
});

router.post('/dologin',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;

    var url = config.getBackendUrlPrefix() + "login";
    var data = {
        "username":username,
        "password":password
    };

    request.post({url:url,form:data},function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);
            if(returnData.statusCode != 0){
                logger.error("admin/article.js -- /admin/dologin fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            } else {
		        res.cookie(mycookies.getAdminAuthorization(), returnData.data.token.access_token, { path: '/' });
		        var path = "<li><a href = \"/admin/index\" class = \"active\">Index</a></li>";
		        var data = {
        		    'path':path
    		    };
		        res.render('admin/v4/index',{'data':data});
            }
        } else {
            logger.error("admin/article.js -- /admin/dologin fail fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("admin/article.js -- /admin/dologin fail fail ..." +
                    "response.statuCode = " + response.statusCode + "..." +
                    "response.body = " + response.body);
            }
            res.render('error/unknowerror');
        }
    });
})


module.exports = router;







