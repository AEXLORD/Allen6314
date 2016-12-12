var express = require('express');
var request = require('request');
var router = express.Router();

var ServerConstant = require('../../commons/constant/ServerConstant.js');
var serverConstant = new ServerConstant();

var MyCookies = require('../../utils/mycookies.js');
var mycookies = new MyCookies();

var Logger = require('../../infrustructure/log/logconfig.js');
var logger = new Logger().getLogger();

router.get('',function(req,res,next){
    res.render('admin/login.html');
});

router.post('/dologin',function(req,res,next){

    var url = serverConstant.getBackendUrlPrefix() + "/oauth/token";
    var data = {
        "username":req.body.username,
        "password":req.body.password,
        "grant_type":serverConstant.getGrantType()
    };
    var headers = {
        "Authorization":"Basic " +
            new Buffer(serverConstant.getClientId() + ":" + serverConstant.getClientSecret()).toString('base64')
    }

    request.post({url:url,form:data,headers:headers},function(error,response,body){
        if(error != null){
            logger.error(error);
            res.render('error/unknowerror');
        }

        var returnData = JSON.parse(body);

        console.log("returnData.access_token = " + returnData.access_token);

        if(returnData.access_token == null || returnData.access_token == "undefined"){
            logger.error(returnData.error);
            logger.error(returnData.error_description);
            res.render('admin/login.html');
        } else {
            console.log("1hello world");
	        res.cookie(mycookies.getAdminAuthorization(), returnData.access_token, { path: '/' });
            res.redirect('/admin/article/index');
        }
    });
})


module.exports = router;







