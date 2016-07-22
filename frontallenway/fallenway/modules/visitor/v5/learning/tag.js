var express = require('express');
var request = require('request');
var async = require('async');
var Config = require('../../../../config/globalconfig');

var config = new Config();
var router = express.Router();

var Logger = require('../../../../config/logconfig');
var logger = new Logger().getLogger();


router.get('/find-articles-by-tagid',function(req,res,next){
    logger.debug("tagid = " + req.query.id);
    async.parallel({
        articles_totalPage:function(callback){
            var url = config.getBackendUrlPrefix() + "article/find-articles-by-tagid?tagid=" +
                                    req.query.id + "&page=1&size=" + config.getArticleListPageSize();
            request(url,function(error,response,body){
            	var returnData = JSON.parse(body);
            	if(returnData.statusCode == 0){
                    callback(null,returnData.data);
                } else {
                    logger.error("visitor/tag.js -- /article/find-articles-by-tagid/ fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
        		}
    	    });
        },
        tags:function(callback){
            request(config.getBackendUrlPrefix() + "tag/find-all-tags-by-some-tag?tagId=" + req.query.id,function(error,response,body){
                var returnData = JSON.parse(body);
                if(returnData.statusCode == 0){
                    callback(null,returnData.data.tags);
                } else {
                    logger.error("visitor/index.js -- tag/find-all-tags fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                }
            });
        }
    },function(err,result){
        if(err == null){
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
            result.moduleName = "learning";
            result.totalPage = new Array();
            for(var i = 1; i <= result.articles_totalPage.totalPage;i++){
                result.totalPage[i-1] = i;
            }
            res.render('visitor/v5/learning/index',{'data':result});
        } else {
            logger.error(err);
            res.render('error/unknowerror');
        }
    })
});

module.exports = router;
