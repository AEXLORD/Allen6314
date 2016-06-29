var express = require('express');
var router = express.Router();

var Logger = require('../../../../config/logconfig.js');
var logger = new Logger().getLogger();

var request = require('request');

var Config = require('../../../../config/globalconfig.js');
var config = new Config();


/*router.get('/to-login',function(req,res,next){*/
    //logger.info("visitor/scrum.js ... /visitor/scrum/login .. ");
    //request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
        //if(!error && response.statusCode == 200){
            //var returnData = JSON.parse(body);

            //if(returnData.statusCode != 0){
                //logger.error("visitor/v2/messageboard/index.js -- module/find-all-modules fail ..." +
                    //"response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                //res.render('error/unknowerror');
            //} else {
                //res.render('visitor/v3/user/login',{'data':returnData.data});
            //}
        //} else {
            //logger.error("visitor/v2/messageboard/index.js -- module/find-all-modules fail ..." +
                //"error = " + error);
            //if(response != null){
                //logger.error("visitor/v2/messageboard/index.js -- module/find-all-modules fail ..." +
                    //"response.statuCode = " + response.statusCode + "..." +
                    //"response.body = " + response.body);
            //}
            //res.render('error/unknowerror');
        //}
    //});
/*})*/



router.post('/do-login',function(req,res,next){
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
                if(returnData.statusCode != 0){
                    logger.error("visitor/v2/user/login.js -- user/login fail ..." +
                        "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                    res.send("/error/unknowerror");
                } else {
                    logger.info("access token = " + returnData.data.token.access_token);
		            res.cookie(config.getVisitorAuthorization(), returnData.data.token.access_token, { path: '/' });
                    res.redirect("/visitor/scrum/index");
                }
            } else {
                logger.error("visitor/v2/user/login.js -- user/login fail ..." +
                    "error = " + error);
                if(response != null){
                    logger.error("visitor/v2/user/login.js -- user/login fail ..." +
                        "response.statuCode = " + response.statusCode + "..." +
                        "response.body = " + response.body);
                }
                res.send("/error/unknowerror");
            }
        });
    } else {
        logger.info("visitor/v2/user/login.js -- username = validloginParam(username,password) = false");
        res.send("/error/unknowerror");
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

module.exports = router;
