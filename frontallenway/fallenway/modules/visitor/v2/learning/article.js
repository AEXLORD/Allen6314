var express = require('express');
var router = express.Router();
var request = require('request');

var async = require('async');
var md = require('node-markdown').Markdown;

var Config = require('../../../../config/globalconfig.js');
var config = new Config();

var Logger = require('../../../../config/logconfig.js');
var logger = new Logger().getLogger();

//根据文章 id 获得具体的文章
router.get('/getArticleDetail',function(req,res,next){

    logger.debug("visitor/v2/learning/article.js -- visitor/learning/article/getArticleDetail ...");

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
                res.render('visitor/v3/learning/articleDetail',{'data':returnData.data});
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
});


//随机获得一篇文章
router.get('/get-random-article',function(req,res,next){
    logger.debug("visitor/v2/learning/article.js -- visitor/learning/article/get-random-article ...");
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
                res.render('visitor/v3/learning/articleDetail',{'data':returnData.data});
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
