var express = require('express');
var router = express.Router();

var Logger = require('../../../../config/logconfig.js');
var logger = new Logger().getLogger();

var request = require('request');

var Config = require('../../../../config/globalconfig.js');
var config = new Config();

var async = require('async');

router.get('',function(req,res,next){
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
        messages_totalPage:function(callback){

            var pageSize = config.getMessageListPageSize();

            var url = config.getBackendUrlPrefix() + "message/find-messages-by-page?" +
                         "page=1" + "&size=" + pageSize;

            console.log("url = " + url);
            request(url,function(error,response,body){
                if(!error && response.statusCode == 200){
                    var returnData = JSON.parse(body);

                    if(returnData.statusCode != 0){
                        logger.error("visitor/v2/messageboard/index.js -- module/find-all-modules fail ..." +
                            "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
                    } else {
                        callback(null,returnData.data);
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
        }
    },function(err,result){
        result.messages = result.messages_totalPage.messages;
        result.totalPage = new Array();

        for(var i = 1; i <= result.messages_totalPage.totalPage;i++){
            result.totalPage[i-1] = i;
        }

        result.nowPageLeft = 0;
        result.nowPage = 1;
        result.nowPageRight = 2;

        res.render('visitor/v3/messageboard/index',{"data":result});
    })
});








router.get('/page',function(req,res,next){
    var pageNum = req.query.pagenum;

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
        messages_totalPage:function(callback){

            var pageSize = config.getMessageListPageSize();

            var url = config.getBackendUrlPrefix() + "message/find-messages-by-page?" +
                         "page=" + pageNum + "&size=" + pageSize;

            console.log("url = " + url);
            request(url,function(error,response,body){
                if(!error && response.statusCode == 200){
                    var returnData = JSON.parse(body);

                    if(returnData.statusCode != 0){
                        logger.error("visitor/v2/messageboard/index.js -- module/find-all-modules fail ..." +
                            "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
                    } else {
                        callback(null,returnData.data);
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
        }
    },function(err,result){

        result.messages = result.messages_totalPage.messages;
        result.totalPage = new Array();

        for(var i = 1; i <= result.messages_totalPage.totalPage;i++){
            result.totalPage[i-1] = i;
        }

        result.nowPageLeft = parseInt(pageNum) - 1;
        result.nowPage = pageNum;
        result.nowPageRight = parseInt(pageNum) + 1;

        res.render('visitor/v3/messageboard/index',{"data":result});
    })
})




router.post('/addmessage',function(req,res,next){
    var username = req.body.username;
    var content = req.body.content;

    console.log("username = " + username + " ,content = " + content);

    if(validAddMessage(username,content)){

        var data = {
            "username":username,
            "content":content
        }
        var url = config.getBackendUrlPrefix() + "message/save-message";
        var options = {
    	    url:url,
	        form:data
        }

        request.post(options,function(error,response,body){
            if(!error && response.statusCode == 200){
                var returnData = JSON.parse(body);

                if(returnData.statusCode != 0){
                    logger.error("visitor/v2/messagesboard/index.js -- message/save-message fail ..." +
                        "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                } else {
                    res.redirect('/visitor/messageboard');
                }
            } else {
                logger.error("visitor/v2/messagesboard/index.js -- message/save-message fail ..." +
                    "error = " + error);
                if(response != null){
                    logger.error("visitor/v2/messagesboard/index.js -- message/save-message fail ..." +
                        "response.statuCode = " + response.statusCode + "..." +
                        "response.body = " + response.body);
                }
                res.render('error/unknowerror');
            }
        });
    } else {
            logger.error("visitor/v2/messagesboard/index.js -- message/save-message validAddMessage(username,content) == false");
         res.render('error/toattack');
    }
})

function validAddMessage(username,content){

    if(username == null || content == null){
        return false;
    } else if (username.trim() == '' || content.trim() == ''){
        return false;
    } else if(username.length > 100 || content.length > 100){
        return false;
    } else if(username.indexOf('\'') > -1 || content.indexOf('\'') > -1){
        return false;
    } else if(username.indexOf('\"') > -1 || content.indexOf('\"') > -1){
        return false;
    } else if(username.indexOf('<') > -1 || content.indexOf('<') > -1){
        return false;
    } else if(username.indexOf('>') > -1 || content.indexOf('>') > -1){
        return false;
    } else {
         return true;
    }
}


module.exports = router;
