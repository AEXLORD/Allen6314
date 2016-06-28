var express = require('express');
var request = require('request');
var async = require('async');
var Config = require('../../../../config/globalconfig.js');

var config = new Config();
var router = express.Router();

var Logger = require('../../../../config/logconfig.js');
var logger = new Logger().getLogger();

router.get('/find-articles-by-tagid',function(req,res,next){
    logger.debug("id = " + req.query.id);

    async.parallel({
        //请求 主页文章 数据
        articles_totalPage:function(callback){
            var pageSize = config.getArticleListPageSize();
            var url = config.getBackendUrlPrefix() + "article/find-articles-by-tagid?tagid=" +
                                    req.query.id + "&page=1&size=" + pageSize;
            request(url,function(error,response,body){
        	    if(!error && response.statusCode == 200){
            		var returnData = JSON.parse(body);

            		if(returnData.statusCode != 0){
                        logger.error("visitor/tag.js -- /article/find-articles-by-tagid/ fail ..." +
                            "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
            	    } else {
                        callback(null,returnData.data);
            		}
        	    } else {
                    logger.error("visitor/tag.js -- /article/find-articles-by-tagid/ fail ..." +
                        "error = " + error);
                    if(response != null){
                        logger.error("visitor/tag.js -- /article/find-articles-by-tagid/ fail ..." +
                            "response.statuCode = " + response.statusCode + "..." +
                            "response.body = " + response.body);
                    }
                    res.render('error/unknowerror');
        	    }
    	    });
        //请求 标签 数据
        },
        tags:function(callback){
            request(config.getBackendUrlPrefix() + "tag/find-all-tags-by-some-tag?tagId=" + req.query.id,function(error,response,body){
                if(!error && response.statusCode == 200){
                    var returnData = JSON.parse(body);
                    if(returnData.statusCode != 0){
                        logger.error("visitor/index.js -- tag/find-all-tags fail ..." +
                            "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
                    } else {
                        callback(null,returnData.data.tags);
                    }
                } else {
                    logger.error("visitor/index.js -- tag/find-all-tags fail ..." +
                        "error = " + error);
                    if(response != null){
                        logger.error("visitor/index.js -- tag/find-all-tags fail ..." +
                            "response.statuCode = " + response.statusCode + "..." +
                            "response.body = " + response.body);
                    }
                    res.render('error/unknowerror');
                }
            });
        },
        modules:function(callback){
            request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
                if(!error && response.statusCode == 200){
                    var returnData = JSON.parse(body);

                    if(returnData.statusCode != 0){
                        logger.error("visitor/v2/visitor_learning/index.js -- module/find-all-modules fail ..." +
                            "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
                    } else {
                        callback(null,returnData.data.modules);
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
        }
    },function(err,result){
        result.articles = result.articles_totalPage.articles;
        result.nowPageLeft = 0;
        result.nowPage = 1;
        result.nowPageRight = 2;
        result.tagid = req.query.id;

        var tag;
        result.tags.forEach(function(entry){
            if(entry.id == req.query.id){
                tag = entry;
            }
        })
        result.moduleid = tag.moduleId;

        result.totalPage = new Array();
        for(var i = 1; i <= result.articles_totalPage.totalPage;i++){
            result.totalPage[i-1] = i;
        }
        res.render('visitor/v3/learning/index',{'data':result});
    })
});

module.exports = router;
