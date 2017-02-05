var express = require('express');
var router = express.Router();
var request = require('request');

var async = require('async');
var md = require('node-markdown').Markdown;

var ServerConstant = require('../../../commons/constant/ServerConstant.js');
var serverConstant = new ServerConstant();

var Logger = require('../../../infrustructure/log/logconfig.js');
var logger = new Logger().getLogger();

var ExceptionCode = require('../../../commons/exception/ExceptionCode.js');
var exceptionCode = new ExceptionCode();

/****************
 跳到某类文章首页
 ****************/
router.get('/module/:type', function(req, res, next) {
    var moduleName = req.params.type;

    if((moduleName != "work") && (moduleName != "read") && (moduleName != "learn")
            && (moduleName != "help") && (moduleName != "myopinion") && (moduleName != "recommend") ){
        logger.error("moduleName = " + moduleName);
        res.render('error/unknowerror');
        return ;
    }

    async.parallel({
        //请求tags
        tags:function(callback){
            var url = serverConstant.getBackendUrlPrefix() + "/module/" + moduleName + "/tag";

            request(url,function(error,response,body){

                if(error != null){
                    callback(error,null);
                }

                var returnData = JSON.parse(body);

                if(returnData.statusCode != 0){
                    logger.error("url = " + url + " --- returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                    return ;
                }

                callback(null,returnData.data)
            });

            //请求该module的文章
        },
        page:function(callback){
            var url = serverConstant.getBackendUrlPrefix() + "/module/" + moduleName + "/article?page=1&size=100";

            request(url,function(error,response,body){
                if(error != null){
                    callback(error,null);
                }

                var returnData = JSON.parse(body);

                if(returnData.statusCode != 0){
                    logger.error("url = " + url + " --- returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                    return ;
                }

                callback(null,returnData.data);
            });
        }
    },function(err,results){
        if(!err){
            res.render('visitor/article/index',{'data':results});
        } else {
            logger.error(err.stack);
            res.render('error/unknowerror');
        }
    })
})

/****************
 查找某个文章
 ****************/
router.get('/:id',function(req,res,next){
    var url = serverConstant.getBackendUrlPrefix() + "/article/" + req.params.id;
    request(url,function(error,response,body){

        if(error != null){
            logger.error(error);
            res.render('error/unknowerror');
            return ;
        }

        var returnData = JSON.parse(body);

        if(returnData.statusCode != 0){
            logger.error("url = " + url + " -- returnData.statusCode = " + returnData.statusCode);
            res.render('error/unknowerror');
            return ;
        }
        returnData.data.content = md(returnData.data.content);
        returnData.data.commentSize = returnData.data.commentList.length;
        res.render('visitor/article/articleDetail',{'data':returnData.data});
    });
});


/****************
 发表评论
 ****************/
router.post('/comment',function(req,res,next){

    var articleId = req.body.articleId;
    var username = req.body.username;
    var password = req.body.password;
    var content = req.body.content;

    if(!validComment(articleId,username,password,content)){
        res.status(exceptionCode.getParamIsInvalid()).end();
        return ;
    }

    var url = serverConstant.getBackendUrlPrefix() + "/comment/new";
    var data = {
            'articleId': articleId,
        	'username': username,
        	'password': password,
         	'content': content,
    	}
    var options = {
    	url:url,
	    form:data
    }

    doSendCommentRequest(options,res);
});

/****************
 回复评论
 ****************/
router.post('/commentReply',function(req,res,next){

    var articleId = req.body.articleId;
    var username = req.body.username;
    var password = req.body.password;
    var content = req.body.content;
    var replyTo = req.body.replyTo;
    var sourceCommentId = req.body.sourceCommentId;

    if(!validCommentReply(articleId,username,password,content,replyTo)){
        res.status(exceptionCode.getParamIsInvalid()).end();
        return ;
    }

    var url = serverConstant.getBackendUrlPrefix() + "/comment/new";
    var data = {
            'articleId': articleId,
        	'username': username,
        	'password': password,
         	'content': content,
         	'replyTo': replyTo,
            'sourceCommentId':sourceCommentId
    	}
    var options = {
    	url:url,
	    form:data
    }

    doSendCommentRequest(options,res);
})

/****************
 显示评论对话
 ****************/
router.post('/showConversation',function(req,res,next){
    var username1 = req.body.username1;
    var username2 = req.body.username2;

    if(username1 == null || username2 == null || username1.length == 0 || username2.length == 0){
        res.status(exceptionCode.getParamIsInvalid()).end();
        return ;
    }

    var data = {
            'username1': username1,
            'username2': username2
    	}
    var url = serverConstant.getBackendUrlPrefix() + "/comment/conversation";
    var options = {
    	url:url,
	    form:data
    }
    request.post(options,function(error,response,body){

        if(error != null){
            logger.error(error);
            res.render('error/unknowerror');
            return ;
        }

        var returnData = JSON.parse(body);

        if(returnData.statusCode != 0){
            logger.error("url = " + url + " -- returnData.statusCode = " + returnData.statusCode);
            res.render('error/unknowerror');
            return ;
        }

        res.json(returnData.data).end();
    });
})

function doSendCommentRequest(options,res){
     request.post(options,function(error,response,body){
        if(error != null){
            logger.error(error);
            res.status(500).end();
            return;
        }

        var returnData = JSON.parse(body);

        if(returnData.statusCode != 0){
            logger.error("returnData.statusCode = " + returnData.statusCode);
            res.status(returnData.statusCode).end();
            return ;
        }

        res.json(returnData.data).end();
    });
}

function validCommentReply(articleId,username,password,content,replyTo){
    if(validComment(articleId,username,password,content)){
         return (replyTo != null) && (replyTo.length != 0);
    } else {
        return false;
    }
}

function validComment(articleId,username,password,content){
    if( (articleId == null) || (articleId.trim() == "")){
        return false;
    }
    if( (password == null) || (password.length != 6)){
        return false;
    }
    if( (username == null) || (username.trim() == "") || (username.length > 30)){
        return false;
    }
    if( (content == null) || (content.trim() == "") || content.trim() > 70){
        return false;
    }
    return true;
}


module.exports = router;
