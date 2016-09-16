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

router.get('/index',function(req,res,next){
    var url = serverConstant.getBackendUrlPrefix() + "/message/findall";
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

        returnData.data.messageSize = returnData.data.length;
        res.render('visitor/message/index',{'data':returnData.data});
    });
});

router.post('/new',function(req,res,next){

    var username = req.body.username;
    var password = req.body.password;
    var content = req.body.content;

    if(!validMessage(username,password,content)){
        res.status(exceptionCode.getParamIsInvalid()).end();
        return ;
    }

    var url = serverConstant.getBackendUrlPrefix() + "/message/new";
    var data = {
        	'username': username,
        	'password': password,
         	'content': content,
    	}
    var options = {
    	url:url,
	    form:data
    }

    doSendMessageRequest(options,res);
});

router.post('/messageReply',function(req,res,next){

    var username = req.body.username;
    var password = req.body.password;
    var content = req.body.content;
    var replyTo = req.body.replyTo;
    var sourceMessageId = req.body.sourceMessageId;

    if(!validMessageReply(username,password,content,replyTo)){
        res.status(exceptionCode.getParamIsInvalid()).end();
        return ;
    }

    var url = serverConstant.getBackendUrlPrefix() + "/message/new";
    var data = {
            'username': username,
            'password': password,
             'content': content,
             'replyTo': replyTo,
            'sourceMessageId':sourceMessageId
        }
    var options = {
        url:url,
        form:data
    }

    doSendMessageRequest(options,res);
})


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
    var url = serverConstant.getBackendUrlPrefix() + "/message/conversation";
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

function doSendMessageRequest(options,res){
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

function validMessageReply(username,password,content,replyTo){
    if(validMessage(username,password,content)){
         return (replyTo != null) && (replyTo.length != 0);
    } else {
        return false;
    }
}

function validMessage(username,password,content){
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
