var express = require('express');
var request = require('request');
var async = require('async');
var Config = require('../../config/globalconfig.js');

var config = new Config();
var router = express.Router();

var Logger = require('../../config/logconfig.js');
var logger = new Logger().getLogger();

router.get('',function(req,res,next){

    logger.debug("visitor/aboutme.js -- /visitor/aboutme ...");

    async.waterfall([
            //请求 分类 数据
            function(callback){
                request(config.getBackendUrlPrefix() + "classify/find-all-first-level-classifies",function(error,response,body){
                    if(!error && response.statusCode == 200){
                        var returnData = JSON.parse(body);

                        if(returnData.statusCode != 0){
                            logger.error("visitor/aboutme.js -- classify/find-all-first-level-classifies fail ..." +
                                   "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                            res.render('error/unknowerror');
                         } else {
                             callback(null,returnData.data);
                        }
                     } else {
                        logger.error("visitor/aboutme.js -- classify/find-all-first-level-classifies fail ..." +
                                   "error = " + error);
                        if(response != null){
                            logger.error("visitor/aboutme.js -- classify/find-all-first-level-classifies fail ..." +
                                   "response.statuCode = " + response.statusCode + "..." +
                                   "response.body = " + response.body);
                        }
                        res.render('error/unknowerror');
                     }
                });
            //请求 管理员 数据
            },function(data,callback){
                request(config.getBackendUrlPrefix() + "admin/find-admin", function (error, response, body) {
		            if (!error && response.statusCode == 200) {
                        var returnData = JSON.parse(body);
                        if(returnData.statusCode != 0){
                            logger.error("visitor/aboutme.js -- admin/find-admin fail ..." +
                                   "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                            res.render('error/unknowerror');
                        } else {
			                data.admin = returnData.data.admin;
                            callback(null,data);
		                }
                    } else {
                        logger.error("visitor/aboutme.js -- admin/find-admin fail ..." +
                                   "error = " + error);
                        if(response != null){
                            logger.error("visitor/aboutme.js -- admin/find-admin fail ..." +
                                   "response.statuCode = " + response.statusCode + "..." +
                                   "response.body = " + response.body);
                        }
                        res.render('error/unknowerror');
		            }
            	})
            },function(data,callback){
                request(config.getBackendUrlPrefix() + "tag/find-all-tags",function(error,response,body){
                    if(!error && response.statusCode == 200){
                        var returnData = JSON.parse(body);
                        if(returnData.statusCode != 0){
                            logger.error("visitor/aboutme.js -- tag/find-all-tags fail ..." +
                                   "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                            res.render('error/unknowerror');
                         } else {
                         data.tags = returnData.data.tags;
                         callback(null,data);
                        }
                     } else {
                        logger.error("visitor/aboutme.js -- tag/find-all-tags fail ..." +
                                   "error = " + error);
                        if(response != null){
                            logger.error("visitor/aboutme.js -- tag/find-all-tags fail ..." +
                                   "response.statuCode = " + response.statusCode + "..." +
                                   "response.body = " + response.body);
                        }
                        res.render('error/unknowerror');
                     }
                });
            }
    ],function(err,result){
        var path = "<li><a href = \"/visitor\">Index</a></li>" +
            "<li><a href = \"/visitor/aboutme\" class = \"active\">About me</a></li>";
        result.path = path;
        res.render('visitor/aboutme',{'data':result});
    });

});

module.exports = router;
