var express = require('express');
var router = express.Router();
var request = require('request');

var async = require('async');
var async1 = require('async');

var Config = require('../../../../config/globalconfig.js');
var config = new Config();

var Logger = require('../../../../config/logconfig.js');
var logger = new Logger().getLogger();

router.get('', function(req, res, next) {

    logger.debug("visitor/v2/visitor_learning/index.js -- /visitor/learning/index ...");

    async.waterfall([
        //请求 全部的 module
        function(callback){
            request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
                if(!error && response.statusCode == 200){
                    var returnData = JSON.parse(body);

                    if(returnData.statusCode != 0){
                        logger.error("visitor/v2/visitor_learning/index.js -- module/find-all-modules fail ..." +
                            "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
                    } else {
                        callback(null,returnData.data);
                    }
                } else {
                    logger.error("visitor/v2/visitor_learning/index.js -- module/find-all-modules fail ..." +
                            "error = " + error);
                    if(response != null){
                        logger.error("visitor/v2/visitor_learning/index.js -- module/find-all-modules fail ..." +
                            "response.statuCode = " + response.statusCode + "..." +
                            "response.body = " + response.body);
                    }
                    res.render('error/unknowerror');
                }
            });
        },function(data,callback){
            var modules = data.modules;
            var moduleId = modules[0].id;
            var results = {};
            async1.parallel({
                //默认取 第一个module 的标签
                tags:function(subcallback){
                    request(config.getBackendUrlPrefix() + "tag/find-tags-by-moduleid?moduleId=" + moduleId,function(error,response,body){
                        if(!error && response.statusCode == 200){
                            var returnData = JSON.parse(body);
                            if(returnData.statusCode != 0){
                                logger.error("visitor/v2/visitor_learning/index.js -- tag/find-all-tags fail ..." +
                                   "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                                res.render('error/unknowerror');
                            } else {
                                subcallback(null,returnData.data.tags);
                            }
                        } else {
                            logger.error("visitor/v2/visitor_learning/index.js -- tag/find-all-tags fail ..." +
                                "error = " + error);
                            if(response != null){
                                logger.error("visitor/v2/visitor_learning/index.js -- tag/find-all-tags fail ..." +
                                   "response.statuCode = " + response.statusCode + "..." +
                                   "response.body = " + response.body);
                            }
                            res.render('error/unknowerror');
                        }
                    });
                //默认取 第一个module 的文章
                },
                articles:function(subcallback){
                    request(config.getBackendUrlPrefix() + "article/find-all-articles-by-moduleid?moduleId=" + moduleId,function(error,response,body){
                        if(!error && response.statusCode == 200){
                            var returnData = JSON.parse(body);

                            if(returnData.statusCode != 0){
                                logger.error("visitor/v2/visitor_learning/index.js -- article/find-all-articles-by-moduleid?moduleId fail ..." +
                                   "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                                res.render('error/unknowerror');
                            } else {
                                subcallback(null,returnData.data.articles);
                            }
                        } else {
                            logger.error("visitor/v2/visitor_learning/index.js -- article/find-all-articles-by-moduleid?moduleId fail ..." +
                                "error = " + error);
                            if(response != null){
                                logger.error("visitor/v2/visitor_learning/index.js -- article/find-all-articles-by-moduleid?moduleId fail ..." +
                                   "response.statuCode = " + response.statusCode + "..." +
                                   "response.body = " + response.body);
                            }
                            res.render('error/unknowerror');
                        }
                    });
                }
            },function(err,results){
                data.tags = results.tags;
                data.articles = results.articles;
                callback(null,data);
            })
        }],function(err,result){
            res.render('visitor/v3/learning/index',{'data':result});
        })
});

module.exports = router;
