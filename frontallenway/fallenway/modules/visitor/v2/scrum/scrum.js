var express = require('express');
var router = express.Router();

var request = require('request');
var async = require('async');
var async1 = require('async');

var Logger = require('../../../../config/logconfig.js');
var logger = new Logger().getLogger();

var Config = require('../../../../config/globalconfig.js');
var config = new Config();

var MyCookies = require('../../../../common_utils/mycookies.js');
var mycookies = new MyCookies();

var ExceptionCode = require('../../../../infrustructure_services/ExceptionCode.js');
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
                        logger.error("visitor/v2/scrum/index.js -- module/find-all-modules fail ..." +
                            "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
                    } else {
                        callback(null,returnData.data.modules);
                    }
                } else {
                    logger.error("visitor/v2/scrum/index.js -- module/find-all-modules fail ..." +
                        "error = " + error);
                    if(response != null){
                        logger.error("visitor/v2/scrum/index.js -- module/find-all-modules fail ..." +
                            "response.statuCode = " + response.statusCode + "..." +
                            "response.body = " + response.body);
                    }
                    res.render('error/unknowerror');
                }
            });
        },
        user:function(callback){
	        if(mycookies.getVisitorAuthorizationCookie() == 'undefined'){
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
                            if(exceptionCode.getUSER_HAS_LOGOUT_Code() == returnData.statusCode){
                                callback(null,null);
                            } else {
                                res.render('error/unknowerror');
                            }
                        } else {
                            callback(null,returnData.data.user);
                        }
                    } else {
                        if(exceptionCode.getUSER_HAS_LOGOUT_Code() == returnData.statusCode){
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



router.post('/add-issue',function(req,res,next){

    var issue = req.body.issue;

    logger.info("issue = " + issue);

    if(validAddIssue(issue)){
        doAddIssue(req,res,issue);
    } else {
        logger.error("validAddIssue(issue) false,issue = " + issue);
        res.status(500).json({error:'issue 不能为空或者仅仅只含空格'});
    }
})

function validAddIssue(issue){
    if(issue == null || issue.trim() == ''){
         return false;
    } else if(issue.length > 10) {
        return false;
    } else {
        return true;
    }
}

function doAddIssue(req,res,issue){
	if(mycookies.getVisitorAuthorizationCookie() == 'undefined'){
        res.status(500).json({error:'尚未登录，无法添加'});
    } else {

        var token = cookies[VisitorAuthorization];
        var url = config.getBackendUrlPrefix() + "issue/add-issue";
        var data = {
            name:issue
        }
        var options = {
	        url:url,
	        headers:{
		        'Authorization': "Bearer " + token
	        },
            form:data
        }

        request.post(options,function(error,response,body){
            if(!error && response.statusCode == 200){
                var returnData = JSON.parse(body);
                if(returnData.statusCode != 0){
                    logger.error("visitor/v2/scrum/scrum.js -- issue/add-issue fail ..." +
                        "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                    res.status(500).json({error:'后台出错，暂时无法添加'});
                } else {
                    res.end();
                }
            } else {
                logger.error("visitor/v2/scrum/scrum.js -- issue/add-issue fail ..." +
                                "error = " + error);
                if(response != null){
                    logger.error("visitor/v2/scrum/scrum.js -- issue/add-issue fail ..." +
                                    "response.statuCode = " + response.statusCode + "..." +
                                    "response.body = " + response.body);
                }
                res.status(500).json({error:'后台出错，暂时无法添加'});
            }
        });
    }
}

module.exports = router;
