var express = require('express');
var router = express.Router();

var Logger = require('../../../../config/logconfig.js');
var logger = new Logger().getLogger();

var request = require('request');

var Config = require('../../../../config/globalconfig.js');
var config = new Config();


router.get('/to-register',function(req,res,next){
    request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);

            if(returnData.statusCode != 0){
                logger.error("visitor/v2/messageboard/index.js -- module/find-all-modules fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            } else {
                res.render('visitor/v3/user/register',{'data':returnData.data});
            }
        } else {
            logger.error("visitor/v2/messageboard/index.js -- module/find-all-modules fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("visitor/v2/messageboard/index.js -- module/find-all-modules fail ..." +
                    "response.statuCode = " + response.statusCode + "..." +
                    "response.body = " + response.body);
            }
            res.render('error/unknowerror');
        }
    });
})



router.post('/do-register',function(req,res,next){
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
                if(returnData.statusCode != 0){
                    logger.error("visitor/v2/user/register.js -- user/register fail ..." +
                        "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                    res.status(500).end();
                } else {
                    res.end();
                }
            } else {
                logger.error("visitor/v2/user/register.js -- user/register fail ..." +
                    "error = " + error);
                if(response != null){
                    logger.error("visitor/v2/user/register.js -- user/register fail ..." +
                        "response.statuCode = " + response.statusCode + "..." +
                        "response.body = " + response.body);
                }
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
