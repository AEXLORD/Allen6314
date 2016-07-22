var express = require('express');
var router = express.Router();
var request = require('request');

var async = require('async');
var async1 = require('async');

var Config = require('../../../../config/globalconfig');
var config = new Config();

var Logger = require('../../../../config/logconfig');
var logger = new Logger().getLogger();


var getModule = function(callback,res){
    request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
                callback(null,returnData.data);
            } else {
                logger.error("visitor/v2/visitor_learning/index.js -- module/find-all-modules fail ..." +
                    " returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            }
        } else {
            res.render('error/unknowerror');
        }
    });
}

/*
 * 网站 index 首页数据
 */
router.get('', function(req, res, next) {
    async.waterfall([
        function(callback){
            getModule(callback,res);
        },function(data,callback){
            var moduleid;
            data.modules.forEach(function(entry){
                if(entry.name == "Learning"){
                    moduleid = entry.id;
                }
            })
            var results = {};
            async1.parallel({
                tags:function(subcallback){
                    request(config.getBackendUrlPrefix() + "tag/find-tags-by-moduleid?moduleid="+moduleid,function(error,response,body){
                        var returnData = JSON.parse(body);
                        if(returnData.statusCode == 0){
                            subcallback(null,returnData.data.tags);
                        } else {
                            logger.error("visitor/v2/visitor_learning/index.js -- tag/find-tags-by-moduleid?moduleid= fail ..." +
                               " returnData.statusCode = " + returnData.statusCode);
                            res.render('error/unknowerror');
                        }
                    });
                },
                articles_totalPage:function(subcallback){
                    var url = config.getBackendUrlPrefix() + "article/find-articles-by-moduleid?moduleid=" +
                                    moduleid + "&page=1&size=" + config.getArticleListPageSize();
                    logger.debug("url = " + url);
                    request(url,function(error,response,body){
                        var returnData = JSON.parse(body);
                        if(returnData.statusCode == 0){
                            subcallback(null,returnData.data);
                        } else {
                            logger.error("visitor/v2/visitor_learning/index.js -- article/find-articles-by-moduleid?moduleid fail ..." +
                               " returnData.statusCode = " + returnData.statusCode);
                            res.render('error/unknowerror');
                        }
                    });
                }
            },function(err,results){
                if(err == null){
                    data.tags = results.tags;
                    data.articles = results.articles_totalPage.articles;
                    data.nowPageLeft = 0;
                    data.nowPage = 1;
                    data.nowPageRight = 2;
                    data.moduleid = moduleid;

                    data.totalPage = new Array();
                    for(var i = 1; i <= results.articles_totalPage.totalPage;i++){
                        data.totalPage[i-1] = i;
                    }

                    callback(null,data);
                } else {
                    logger.error(err.stack);
                    res.render('error/unknowerror');
                }
            })
        }],function(err,result){
            if(err == null){
                res.render('visitor/v4/learning/index',{'data':result});
            } else {
                logger.error(err.stack);
                res.render('error/unknowerror');
            }
        }
    )
});

module.exports = router;
