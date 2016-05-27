var express = require('express');
var router = express.Router();
var request = require('request');

var async = require('async');
var md = require('node-markdown').Markdown;

var Config = require('../../config/globalconfig.js');
var config = new Config();

var Logger = require('../../config/logconfig.js');
var logger = new Logger().getLogger();

//根据文章 id 获得具体的文章
router.get('/getArticleDetail',function(req,res,next){

    logger.debug("visitor/article.js -- /article/getArticleDetail ...");

    async.waterfall([
            //请求 文章 数据
            function(callback){
                request(config.getBackendUrlPrefix() + "article/find-article-by-id?id=" + req.query.id,function(error,response,body){
                    if(!error && response.statusCode == 200){
                        var returnData = JSON.parse(body);

                        if(returnData.statusCode != 0){
                            logger.error("visitor/article.js -- article/find-article-by-id?id=xx fail ..." +
                                   "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                            res.render('error/unknowerror');
                         } else {
                            var article = returnData.data.article;
                            article.content = md(article.content);
                            callback(null,returnData.data);
                        }
                     } else {
                        logger.error("visitor/article.js -- article/find-article-by-id?id=xx fail ..." +
                                   "error = " + error);
                        if(response != null){
                            logger.error("visitor/article.js -- article/find-article-by-id?id=xx fail ..." +
                                   "response.statuCode = " + response.statusCode + "..." +
                                   "response.body = " + response.body);
                        }
                        res.render('error/unknowerror');
                     }
                });
            //请求 标签 数据
            },function(data,callback){
                request(config.getBackendUrlPrefix() + "tag/find-all-tags",function(error,response,body){
                    if(!error && response.statusCode == 200){
                        var returnData = JSON.parse(body);
                        if(returnData.statusCode != 0){
                            logger.error("visitor/article.js -- tag/find-all-tags fail ..." +
                                   "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                            res.render('error/unknowerror');
                         } else {
                            data.tags = returnData.data.tags;
                            callback(null,data);
                        }
                     } else {
                        logger.error("visitor/article.js -- tag/find-all-tags fail ..." +
                                   "error = " + error);
                        if(response != null){
                            logger.error("visitor/article.js -- tag/find-all-tags fail ..." +
                                   "response.statuCode = " + response.statusCode + "..." +
                                   "response.body = " + response.body);
                        }
                        res.render('error/unknowerror');
                     }
                });
            }
    ],function(err,result){
        res.render('visitor/v2/articleDetail',{'data':result});
    });
});


//随机获得一篇文章
router.get('/get-random-article',function(req,res,next){
    request(config.getBackendUrlPrefix() + "article/find-random-article",function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);
            if(returnData.statusCode != 0){
                logger.error("visitor/article.js -- article/get-random-article fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            } else {
                var article = returnData.data.article;
                article.content = md(article.content);
                res.render('visitor/v2/articleDetail',{'data':returnData.data});
            }
        } else {
            logger.error("visitor/article.js -- article/get-random-article fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("visitor/article.js -- article/get-random-article fail ..." +
                    "response.statuCode = " + response.statusCode + "..." +
                    "response.body = " + response.body);
            }
            res.render('error/unknowerror');
        }
    });
})



module.exports = router;
