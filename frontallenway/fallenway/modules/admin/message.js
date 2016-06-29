var express = require('express');
var router = express.Router();

var md = require('node-markdown').Markdown;
var request = require('request');
var async = require('async');

var Config = require('../../config/globalconfig.js');
var config = new Config();

var MyCookies = require('../../config/mycookies.js');
var mycookies = new MyCookies();

var Logger = require('../../config/logconfig.js');
var logger = new Logger().getLogger();


//留言管理首页
router.get('',function(req,res,next){
    var cookies = mycookies.getMyCookies(req);
    var pageSize = config.getMessageListPageSize();
    var url = config.getBackendUrlPrefix() + "auth/message/find-messages-by-page?" +
                "page=1&size=" + pageSize;

    var options = {
    	url:url,
    	headers:{
            'Authorization': "Bearer " + cookies['Authorization']
		}
    }

    request(options,function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);

            if(returnData.statusCode != 0){
                logger.error("admin/message.js -- auth/message/find-messages-by-page fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            } else {
                var result = {};
                result.messages = returnData.data.messages;
                result.totalPage = new Array();

                for(var i = 1; i <= returnData.data.totalPage;i++){
                    result.totalPage[i-1] = i;
                }

                result.nowPageLeft = 0;
                result.nowPage = 1;
                result.nowPageRight = 2;

                res.render('admin/message/messageIndex',{'data':result});
            }
        } else {
            logger.error("admin/message.js -- auth/message/find-messages-by-page fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("admin/message.js -- auth/message/find-messages-by-page fail ..." +
                    "response.statuCode = " + response.statusCode + "..." +
                    "response.body = " + response.body);
            }
            res.render('error/unknowerror');
        }
    })
});




router.get('/page',function(req,res,next){
    var pageNum = req.query.pagenum;
    var cookies = mycookies.getMyCookies(req);
    var pageSize = config.getMessageListPageSize();
    var url = config.getBackendUrlPrefix() + "auth/message/find-messages-by-page?" +
                "page="+ pageNum +"&size=" + pageSize;
    var options = {
    	url:url,
    	headers:{
            'Authorization': "Bearer " + cookies['Authorization']
		}
    }

    request(options,function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);

            if(returnData.statusCode != 0){
                logger.error("admin/message.js -- auth/message/find-messages-by-page fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            } else {
                var result = {};
                result.messages = returnData.data.messages;
                result.totalPage = new Array();

                for(var i = 1; i <= returnData.data.totalPage;i++){
                    result.totalPage[i-1] = i;
                }

                result.nowPageLeft = parseInt(pageNum) - 1;
                result.nowPage = pageNum;
                result.nowPageRight = parseInt(pageNum) + 1;

                res.render('admin/message/messageIndex',{'data':result});
            }
        } else {
            logger.error("admin/message.js -- auth/message/find-messages-by-page fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("admin/message.js -- auth/message/find-messages-by-page fail ..." +
                    "response.statuCode = " + response.statusCode + "..." +
                    "response.body = " + response.body);
            }
            res.render('error/unknowerror');
        }
    })
});




router.get('/delete',function(req,res,next){
    var cookies = mycookies.getMyCookies(req);
    var data = {'id': req.query.id}

    var url = config.getBackendUrlPrefix() + "auth/message/delete-message";
    var options = {
    	url:url,
    	headers:{
            'Authorization': "Bearer " + cookies['Authorization']
		},
	    form:data
    }
    request.post(options,function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);

            if(returnData.statusCode != 0){
                logger.error("admin/message.js -- auth/message/delete-message fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            } else {
                res.redirect('/admin/message');
            }
        } else {
            logger.error("admin/message.js -- auth/message/delete-message fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("admin/message.js -- auth/message/delete-message fail ..." +
                    "response.statuCode = " + response.statusCode + "..." +
                    "response.body = " + response.body);
            }
            res.render('error/unknowerror');
        }
    })
})



module.exports = router;
