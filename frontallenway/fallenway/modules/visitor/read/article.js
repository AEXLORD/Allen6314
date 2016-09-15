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
        res.render('visitor/read/articleDetail',{'data':returnData.data});
    });
});

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

    request.post(options,function(error,response,body){
        if(error != null){
            logger.error(error);
            res.status(500).end();
            return;
        }

        var returnData = JSON.parse(body);

        console.log("returnData.statusCode = " + returnData.statusCode);

        if(returnData.statusCode != 0){
            logger.error("returnData.statusCode = " + returnData.statusCode);
            res.status(returnData.statusCode).end();
            return ;
        }

        res.status(200).end();
    });
});

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
