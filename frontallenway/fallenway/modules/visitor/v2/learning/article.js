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
    async.parallel({
        article:function(callback){
            var url = config.getBackendUrlPrefix() + "article/find-article-by-id?id=" + req.query.id;
            request(url,function(error,response,body){
                var returnData = JSON.parse(body);

                if(returnData.statusCode != 0){
                    logger.error("visitor/article.js -- article/find-article-by-id?id=xx fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                } else {
                    returnData.data.article.content = md(returnData.data.article.content);
                    callback(null,returnData.data.article);
                }
            });
        },
        modules:function(callback){
            request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
                var returnData = JSON.parse(body);

                if(returnData.statusCode != 0){
                    logger.error("visitor/v2/visitor_learning/index.js -- module/find-all-modules fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                } else {
                    callback(null,returnData.data.modules);
                }
            });
        }
    },function(err,results){
        if(err != null){
            logger.error(err.stack);
            res.render('error/unknowerror');
        } else {
            res.render('visitor/v3/learning/articleDetail',{'data':results});
        }
    })
});


//随机获得一篇文章
router.get('/get-random-article',function(req,res,next){
    async.parallel({
        article:function(callback){
            request(config.getBackendUrlPrefix() + "article/find-random-article",function(error,response,body){
                var returnData = JSON.parse(body);
                if(returnData.statusCode != 0){
                    logger.error("visitor/article.js -- article/get-random-article fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                } else {
                    var article = returnData.data.article;
                    article.content = md(article.content);
                    callback(null,returnData.data.article);
                }
            });
        },
        modules:function(callback){
            request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
                var returnData = JSON.parse(body);

                if(returnData.statusCode != 0){
                    logger.error("visitor/v2/visitor_learning/index.js -- module/find-all-modules fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                } else {
                    callback(null,returnData.data.modules);
                }
            });
        }
    },function(err,results){
        if(err != null){
            logger.error(err.stack);
            res.render('error/unknowerror');
        } else {
            res.render('visitor/v3/learning/articleDetail',{'data':results});
        }
    })
})





router.get('/page',function(req,res,next){
    var pageNum = req.query.pagenum;
    var moduleid = req.query.moduleid;
    var tagid = req.query.tagid;

    async.parallel({
        modules: function(callback){
            request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
                var returnData = JSON.parse(body);

                if(returnData.statusCode != 0){
                    logger.error("visitor/v2/visitor_learning/article.js -- module/find-all-modules fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                } else {
                    callback(null, returnData.data.modules);
                }
            });
        },
        tags: function(callback){
            request(config.getBackendUrlPrefix() + "tag/find-tags-by-moduleid?moduleid=" + moduleid,function(error,response,body){
                var returnData = JSON.parse(body);
                if(returnData.statusCode != 0){
                    logger.error("visitor/v2/visitor_learning/article.js -- tag/find-tags-by-moduleid?moduleid= fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                } else {
                    callback(null,returnData.data.tags);
                }
            });
        },
        articles_totalPage: function(callback){

            var url;
            var pageSize = config.getArticleListPageSize();

            if(tagid != ""){
                url = config.getBackendUrlPrefix() + "article/find-articles-by-tagid?tagid=" +
                        tagid + "&page="+ pageNum +"&size=" + pageSize;
            } else {
                url = config.getBackendUrlPrefix() + "article/find-articles-by-moduleid?moduleid=" +
                        moduleid + "&page=" + pageNum + "&size=" + pageSize;
            }

            request(url,function(error,response,body){
                var returnData = JSON.parse(body);

                if(returnData.statusCode != 0){
                    logger.error("visitor/v2/visitor_learning/article.js -- article/find-articles-by-moduleid?moduleid fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                } else {
                    callback(null,returnData.data);
                }
            });
        }
    },function(err,result){
        if(err != null){
            logger.error(err.stack);
            res.render('error/unknowerror');
        } else {
            result.articles = result.articles_totalPage.articles;
            result.totalPage = new Array();

            for(var i = 1; i <= result.articles_totalPage.totalPage;i++){
                result.totalPage[i-1] = i;
            }

            result.nowPageLeft = parseInt(pageNum) - 1;
            result.nowPage = pageNum;
            result.nowPageRight = parseInt(pageNum) + 1;
            result.moduleid = moduleid;
            result.tagid = tagid;

            res.render('visitor/v3/learning/index',{'data':result});
        }
    });
})





module.exports = router;
