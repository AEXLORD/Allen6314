var express = require('express');
var request = require('request');
var async = require('async');
var md = require('node-markdown').Markdown;
var Config = require('../../config/globalconfig.js');

var config = new Config();
var router = express.Router();

var Logger = require('../../config/logconfig.js');
var logger = new Logger().getLogger();

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
            //请求推荐文章的数量
            /*},function(data,callback){*/
                //request(config.getBackendUrlPrefix() + "article/get-recommend-articles",function(error,response,body){
                    //if(!error && response.statusCode == 200){
                        //var returnData = JSON.parse(body);
                        //if(returnData.statusCode != 0){
                            //console.log('request for get tags fail!');
                         //} else {
                         //data.recommendArticles= returnData.data.recommendArticles;
                         //callback(null,data);
                        //}
                     //} else {
                         //console.log('request for get tags fail!');
                     //}
                /*});*/
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

        var path = "<li><a href = \"/visitor\">Index</a></li>" +
            "<li class = \"active\">Article Detail</li>";
        result.path = path;
        res.render('visitor/articleDetail',{'data':result});
    });
});

router.post('/leaveMsg',function(req,res,next){

    logger.debug("visitor/article.js -- /article/leaveMsg ...");

    var url = config.getBackendUrlPrefix() + "comment/add-comment";
    var data = {
        'id':req.body.id,
        'name':req.body.name,
        'email':req.body.email,
        'content':req.body.content
    };
    request.post({url:url,form:data},function(err,response,body){
        if(!err && response.statusCode == 200){
            var returnData = JSON.parse(body);
            if(returnData.statusCode != 0){
                logger.error("visitor/article.js -- comment/add-comment fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            } else {
                res.redirect('/visitor/article/getArticleDetail?id=' + req.body.id);
            }
        } else {
            logger.error("visitor/article.js -- comment/add-comment fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("visitor/article.js -- comment/add-comment fail ..." +
                    "response.statuCode = " + response.statusCode + "..." +
                    "response.body = " + response.body);
            }
            res.render('error/unknowerror');
        }
    });
})

module.exports = router;
