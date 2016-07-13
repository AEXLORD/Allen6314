var express = require('express');
var router = express.Router();

var Logger = require('../../../../config/logconfig');
var logger = new Logger().getLogger();

var request = require('request');

var Config = require('../../../../config/globalconfig');
var config = new Config();

var MyCookies = require('../../../../common_utils/mycookies');
var mycookies = new MyCookies();

var ExceptionCode = require('../../../../infrustructure_services/ExceptionCode');
var exceptionCode = new ExceptionCode();

router.get('/login/to-login',function(req,res,next){
    request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
                res.render('visitor/v4/user/login',{'data':returnData.data});
            } else {
                logger.error("visitor/v2/messageboard/index.js -- module/find-all-modules fail ..." +
                    " but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            }
        } else {
            logger.error(err);
            res.render('error/unknowerror');
        }
    });
})




router.post('/login/do-login',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    logger.info("visitor/v2/user/login.js -- username = " + username);
    logger.info("visitor/v2/user/login.js -- password = " + password);

    if(validloginParam(username,password)){
        var url = config.getBackendUrlPrefix() + "user/login";
        var data = {
            "username":username,
            "password":password
        };

        request.post({url:url,form:data},function(error,response,body){
            if(!error && response.statusCode == 200){
                var returnData = JSON.parse(body);
                if(returnData.statusCode == 0){
                    logger.info("access token = " + returnData.data.token.access_token);
		            res.cookie(mycookies.getVisitorAuthorization(req), returnData.data.token.access_token, { path: '/' });
                    res.redirect("/visitor/scrum/index");
                } else if(returnData.statusCode == exceptionCode.getUSERNAME_PASSWORD_WRONG()){
                    res.render('visitor/v4/user/login',{"error":"用户名或者密码错误"});
                } else {
                    logger.error(error);
                    res.render("error/unknowerror");
                }
            } else {
                logger.error(error);
                res.render("error/unknowerror");
            }
        });
    } else {
        logger.info("visitor/v2/user/login.js -- username = validloginParam(username,password) = false");
        res.render('visitor/v4/user/login',{"error":"用户名或者密码不能为空"});
    }
})
function validloginParam(username,password){
    if(username == null || username.trim() == ''){
        return false;
    } else if(password == null || password.trim() == ''){
        return false;
    } else {
        return true;
    }
}





router.get('/logout',function(req,res,next){
    logger.info("id = " + req.query.id);
    request(config.getBackendUrlPrefix() + "user/logout?id="+req.query.id,function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);
            if(returnData.statusCode != 0){
                res.redirect("/visitor/scrum");
            } else {
                logger.error("visitor/v2/messageboard/index.js -- module/find-all-modules fail ..." +
                    " returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            }
        } else {
            logger.error(err);
            res.render('error/unknowerror');
        }
    });
})




router.get('/register/to-register',function(req,res,next){
    request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
                res.render('visitor/v4/user/register',{'data':returnData.data});
            } else {
                logger.error("visitor/v2/messageboard/index.js -- module/find-all-modules fail ..." +
                    " but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            }
        } else {
            logger.error(err);
            res.render('error/unknowerror');
        }
    });
})




router.post('/register/do-register',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    var password1 = req.body.password1;
    logger.info("visitor/v2/user/register.js -- username = " + username);
    logger.info("visitor/v2/user/register.js -- password = " + password);
    logger.info("visitor/v2/user/register.js -- password1 = " + password1);

    if(validRegisterParam(username,password,password1)){
        var url = config.getBackendUrlPrefix() + "user/register";
        var data = {
            "username":username,
            "password":password
        };
        request.post({url:url,form:data},function(error,response,body){
            if(!error && response.statusCode == 200){
                var returnData = JSON.parse(body);
                if(returnData.statusCode == 0){
                    res.end();
                } else {
                    logger.error("visitor/v2/user/register.js -- user/register fail ..." +
                        " but returnData.statusCode = " + returnData.statusCode);
                    res.status(500).end();
                }
            } else {
                logger.error("visitor/v2/user/register.js -- user/register fail ..." +
                    "error = " + error);
                res.status(500).end();
            }
        });
    } else {
        logger.info("visitor/v2/user/register.js -- username = validRegisterParam(username,password,password1) = false");
        res.status(500).end();
    }
})
function validRegisterParam(username,password,password1){
    if(username == null || username.trim() == ''){
        return false;
    } else if(password == null || password.trim() == ''){
        return false;
    } else if (password1 == null || password1.trim() == ''){
         return false;
    } else if(password != password1){
        return false;
    } else {
        return true;
    }
}

module.exports = router;
