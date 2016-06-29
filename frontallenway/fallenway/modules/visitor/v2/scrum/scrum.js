var express = require('express');
var router = express.Router();

var request = require('request');
var async = require('async');
var async1 = require('async');

var Logger = require('../../../../config/logconfig.js');
var logger = new Logger().getLogger();

var Config = require('../../../../config/globalconfig.js');
var config = new Config();

var MyCookies = require('../../../../config/mycookies.js');
var mycookies = new MyCookies();

var ExceptionCode = require('../../../../config/exceptioncode.js');
var exceptionCode = new ExceptionCode();

router.get('',function(req,res,next){
    res.redirect('/visitor/scrum/index');
});




router.get('/index',function(req,res,next){
    async.parallel({
        modules:function(callback){
            request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
                if(!error && response.statusCode == 200){
                    var returnData = JSON.parse(body);

                    if(returnData.statusCode != 0){
                        logger.error("visitor/v2/messageboard/index.js -- module/find-all-modules fail ..." +
                            "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
                    } else {
                        callback(null,returnData.data.modules);
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
        },
        user:function(callback){
            var cookies = mycookies.getMyCookies(req);
            var VisitorAuthorization = mycookies.getVisitorAuthorization();
	        if(cookies[VisitorAuthorization] == 'undefined'){
                callback(null,null);
	        } else {
                var token = cookies[VisitorAuthorization];
                var url = config.getBackendUrlPrefix() + "user/find-user-by-token?token=" + token;

                var options = {
	                url:url,
	                headers:{
		                'Authorization': "Bearer " + token
	                }
                }

                request(options,function(error,response,body){
                    if(!error && response.statusCode == 200){
                        var returnData = JSON.parse(body);

                        if(returnData.statusCode != 0){
                            logger.error("visitor/v2/scrum/scrum.js -- user/find-user-by-token?token= fail ..." +
                                "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                            if(exceptionCode.getUserHasLogoutCode() == returnData.statusCode){
                                callback(null,null);
                            } else {
                                res.render('error/unknowerror');
                            }
                        } else {
                            callback(null,returnData.data.user);
                        }
                    } else {
                        if(exceptionCode.getUserHasLogoutCode() == returnData.statusCode){
                            callback(null,null);
                        } else {
                            logger.error("visitor/v2/scrum/scrum.js -- user/find-user-by-token?token= fail ..." +
                                "error = " + error);
                            if(response != null){
                                logger.error("visitor/v2/scrum/scrum.js -- user/find-user-by-token?token= fail ..." +
                                    "response.statuCode = " + response.statusCode + "..." +
                                    "response.body = " + response.body);
                            }
                            res.render('error/unknowerror');
                        }
                    }
                });
            }
        }
    },function(err,result){
        res.render('visitor/v3/scrum/scrumIndex',{'data':result});
    })
})



module.exports = router;
