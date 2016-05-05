var express = require('express');
var request = require('request');

var Config = require('../../config/globalconfig.js');
var config = new Config();

var router = express.Router();

var Logger = require('../../config/logconfig.js');
var logger = new Logger().getLogger();

router.get('',function(req,res,next){
    res.render('admin/login.html');
});

router.post('/dologin',function(req,res,next){

    logger.debug("admin/login.js -- /admin/dologin ...");

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
		        res.cookie('Authorization', returnData.data.token.access_token, { path: '/' });
		        var path = "<li><a href = \"/admin\" class = \"active\">Index</a></li>";
		        var data = {
        		    'path':path
    		    };
		        res.render('admin/index',{'data':data});
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







