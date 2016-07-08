var express = require('express');
var router = express.Router();

var request = require('request');
var async = require('async');
var async1 = require('async');

var Logger = require('../../../../config/logconfig');
var logger = new Logger().getLogger();

var Config = require('../../../../config/globalconfig');
var config = new Config();

var MyCookies = require('../../../../common_utils/mycookies');
var mycookies = new MyCookies();

var ExceptionCode = require('../../../../infrustructure_services/ExceptionCode');
var exceptionCode = new ExceptionCode();


router.get('',function(req,res,next){
    res.redirect('/visitor/scrum/index');
});


router.get('/index',function(req,res,next){
    async.parallel({
        modules:function(callback){
            request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
                var returnData = JSON.parse(body);
                if(returnData.statusCode == 0){
                    callback(null,returnData.data.modules);
                } else {
                    logger.error("visitor/v2/scrum/index.js -- module/find-all-modules fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                }
            });
        },
        user_issues_items:function(callback){
            var u_s_i = {};
            async.waterfall([
                function(callback1){
                    var options = {
                        url:config.getBackendUrlPrefix() + "user/find-user-by-token?token=" + mycookies.getVisitorAuthorizationCookie(req),
                        headers:{
                            'Authorization': "Bearer " + mycookies.getVisitorAuthorizationCookie(req)
                        }
                    }
                    request(options,function(error,response,body){
                        var returnData = JSON.parse(body);
                        if( returnData.statusCode == 0) {
                            u_s_i.user = returnData.data.user;
                            callback1(null,u_s_i);
                        } else if (returnData.statusCode == exceptionCode.getUSER_HAS_LOGOUT_Code()) {
                           callback1(null,null);
                        } else {
                            logger.error("visitor/v2/scrum/scrum.js -- /index -- user/find-user-by-token?token= fail ..." +
                                "error = " + error);
                            res.render('error/unknowerror');
                        }
                    });
                },function(data,callback2){
                    if(data == null){
                         callback2(null,null);
                    } else {
                        var options = {
                            url:config.getBackendUrlPrefix() + "issue/find-all-issues?userid=" + data.user.id,
                            headers:{
                                'Authorization': "Bearer " + mycookies.getVisitorAuthorizationCookie(req)
                            }
                        }
                        request(options,function(error,response,body){
                            var returnData = JSON.parse(body);
                            if( returnData.statusCode == 0) {
                                u_s_i.issues = returnData.data.issues;
                                callback2(null,u_s_i);
                            } else if (returnData.statusCode == exceptionCode.getUSER_HAS_LOGOUT_Code()) {
                                callback2(null,null);
                            } else {
                                 logger.error("visitor/v2/scrum/scrum.js -- issue/find-all-issues?userid= fail ..." +
                                    "error = " + error);
                                res.render('error/unknowerror');
                            }
                        });
                    }
                },function(data,callback3){
                    if(data == null){
                         callback3(null,null);
                    } else {
                        var options = {
                            url:config.getBackendUrlPrefix() + "item/find-all-items?userid=" + data.user.id,
                            headers:{
                                'Authorization': "Bearer " + mycookies.getVisitorAuthorizationCookie(req)
                            }
                        }
                        request(options,function(error,response,body){
                            var returnData = JSON.parse(body);
                            if( returnData.statusCode == 0) {
                                u_s_i.items_icebox = returnData.data.items_icebox;
                                u_s_i.items_inprogress = returnData.data.items_inprogress;
                                u_s_i.items_testing = returnData.data.items_testing;
                                u_s_i.items_complete = returnData.data.items_complete;
                                callback3(null,u_s_i);
                            } else if (returnData.statusCode == exceptionCode.getUSER_HAS_LOGOUT_Code()) {
                                callback3(null,null);
                            } else {
                                 logger.error("visitor/v2/scrum/scrum.js -- issue/find-all-issues?userid= fail ..." +
                                    "error = " + error);
                                res.render('error/unknowerror');
                            }
                        });
                    }
                }

            ],function(err,result){
                if(err == null){
                    callback(null,u_s_i);
                } else {
                    logger.error(err.stack);
                    res.render('error/unknowerror');
                }
            })
        }
    },function(err,result){
        if(err == null){
            result.user = result.user_issues_items.user;
            result.issues = result.user_issues_items.issues;
            result.items_icebox = result.user_issues_items.items_icebox;
            result.items_inprogress = result.user_issues_items.items_inprogress;
            result.items_testing = result.user_issues_items.items_testing;
            result.items_complete = result.user_issues_items.items_complete;
            res.render('visitor/v3/scrum/scrumIndex',{'data':result});
        } else {
            logger.error(err.stack);
            res.render('error/unknowerror');
        }
    })
})




router.post('/add-issue',function(req,res,next){
    var issue = req.body.issue;
    var color = req.body.color;
    var userId = req.body.userid;
    logger.info("issue = " + issue + " ,color = " + color + " ,userid = " + userId);

    if(validAddIssue(issue)){
        doAddIssue(req,res,issue,color,userId);
    } else {
        logger.error("validAddIssue(issue) false,issue = " + issue);
        res.status(500).json({error:'issue 不能为空或者仅仅只含空格'});
    }
})
function validAddIssue(issue){
    if(issue == null || issue.trim() == ''){
         return false;
    } else if(issue.length > 20) {
        return false;
    } else {
        return true;
    }
}
function doAddIssue(req,res,issue,color,userId){
	if(mycookies.getVisitorAuthorizationCookie(req) == 'undefined'){
        res.status(500).json({error:'尚未登录，无法添加'});
    } else {
        var options = {
	        url:config.getBackendUrlPrefix() + "issue/add-issue",
	        headers:{
		        'Authorization': "Bearer " + mycookies.getVisitorAuthorizationCookie(req)
	        },
            form:{'name':issue,'color':color,'userId':userId}
        }
        request.post(options,function(error,response,body){
            if(!error && response.statusCode == 200){
                var returnData = JSON.parse(body);
                if(returnData.statusCode == 0){
                    res.send({'issue':returnData.data.issue});
                } else {
                    logger.error("visitor/v2/scrum/scrum.js -- issue/add-issue fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.status(500).json({error:'后台出错，暂时无法添加'});
                }
            } else {
                logger.error("visitor/v2/scrum/scrum.js -- issue/add-issue fail ..." +
                                "error = " + error);
                res.status(500).json({error:'后台出错，暂时无法添加'});
            }
        });
    }
}




router.post('/delete-issue-by-id',function(req,res,next){
    logger.info("issueId = " + req.body.issueId);
    var options = {
        url:config.getBackendUrlPrefix() + "issue/delete-issue-by-id",
        headers:{
	        'Authorization': "Bearer " + mycookies.getVisitorAuthorizationCookie(req)
        },
        form:{'issueId':req.body.issueId}
    }
    request.post(options,function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == exceptionCode.getISSUE_HAS_ITEMS()){
                res.json({error:'该 issue 还存在子 item，所以无法删除'});
            } else if(returnData.statusCode == 0){
                res.end();
            } else {
                logger.error("visitor/v2/scrum/scrum.js -- issue/delete-issue-by-id fail ..." +
                    " returnData.statusCode = " + returnData.statusCode);
                res.status(500).json({error:'后台出错，暂时无法修改'});
            }
        } else {
            logger.error("visitor/v2/scrum/scrum.js -- issue/delete-issue-by-id fail ..." +
                        "error = " + error);
            res.json({error:'后台出错，暂时无法删除'});
        }
    });
})





router.post('/add-item',function(req,res,next){
    var name = req.body.name;
    var issueId = req.body.issueId;
    var userId = req.body.userid;

    logger.info("name = " + name + " ,issueId = " + issueId + " ,userid = " + userId);

    if(validAddItem(name)){
        doAddItem(req,res,name,issueId,userId);
    } else {
        logger.error("validAddItem(item) false,item = " + item);
        res.status(500).json({error:'item 不能为空或者仅仅只含空格'});
    }
})
function validAddItem(item){
    if(item == null || item.trim() == ''){
         return false;
    } else if(item.length > 20) {
        return false;
    } else {
        return true;
    }
}
function doAddItem(req,res,name,issueId,userId){
	if(mycookies.getVisitorAuthorizationCookie(req) == 'undefined'){
        res.status(500).json({error:'尚未登录，无法添加'});
    } else {
        var options = {
	        url:config.getBackendUrlPrefix() + "item/add-item",
	        headers:{
		        'Authorization': "Bearer " + mycookies.getVisitorAuthorizationCookie(req)
	        },
            form:{'name':name,'issueId':issueId,'userId':userId}
        }

        request.post(options,function(error,response,body){
            if(!error && response.statusCode == 200){
                var returnData = JSON.parse(body);
                if(returnData.statusCode == 0){
                    res.send({'item':returnData.data.item});
                } else {
                    logger.error("visitor/v2/scrum/scrum.js -- issue/add-item fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.status(500).json({error:'后台出错，暂时无法添加'});
                }
            } else {
                logger.error("visitor/v2/scrum/scrum.js -- issue/add-item fail ..." +
                                "error = " + error);
                res.status(500).json({error:'后台出错，暂时无法添加'});
            }
        });
    }
}




router.post('/update-item-type',function(req,res,next){
    logger.info("id = " + req.body.itemId);
    logger.info("type = " + req.body.type);
    var options = {
        url:config.getBackendUrlPrefix() + "item/update-item-type",
        headers:{
	        'Authorization': "Bearer " + mycookies.getVisitorAuthorizationCookie(req)
        },
        form:{'itemId':req.body.itemId,'type':req.body.type}
    }
    request.post(options,function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
                res.end();
            } else {
                logger.error("visitor/v2/scrum/scrum.js -- item/update-item-type fail ..." +
                    " returnData.statusCode = " + returnData.statusCode);
                res.status(500).json({error:'后台出错，暂时无法修改'});
            }
        } else {
            logger.error("visitor/v2/scrum/scrum.js -- item/update-item-type fail ..." +
                        "error = " + error);
        res.status(500).json({error:'后台出错，暂时无法修改'});
        }
    });
})




router.post('/delete-item-by-id',function(req,res,next){
    logger.info("itemId = " + req.body.itemId);
    var options = {
        url:config.getBackendUrlPrefix() + "item/delete-item-by-id",
        headers:{
	        'Authorization': "Bearer " + mycookies.getVisitorAuthorizationCookie(req)
        },
        form:{'itemId':req.body.itemId}
    }
    request.post(options,function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
                res.end();
            } else {
                logger.error("visitor/v2/scrum/scrum.js -- item/delete-item-by-id fail ..." +
                    " returnData.statusCode = " + returnData.statusCode);
                res.status(500).json({error:'后台出错，暂时无法修改'});
            }
        } else {
            logger.error("visitor/v2/scrum/scrum.js -- item/delete-item-by-id fail ..." +
                        "error = " + error);
        res.status(500).json({error:'后台出错，暂时无法删除'});
        }
    });
})

module.exports = router;
