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
    var url = serverConstant.getBackendUrlPrefix() + "/login";
    var data = {
        "username":req.body.username,
        "password":req.body.password
    };

    request.post({url:url,form:data},function(error,response,body){
        if((error != null) || (response.statusCode != 200)){
            logger.error(error);
            res.render('error/unknowerror');
        }

        var returnData = JSON.parse(body);
        if(returnData.statusCode != 0){
            logger.error("url = " + url + " -- returnData.statusCode = " + returnData.statusCode);
            res.render('error/unknowerror');
        }
		res.cookie(mycookies.getAdminAuthorization(), returnData.data.token.access_token, { path: '/' });
        res.redirect('/admin/article/index');
    });
})


module.exports = router;







