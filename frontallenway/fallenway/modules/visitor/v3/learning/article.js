var express = require('express');
var router = express.Router();
var request = require('request');

var async = require('async');
var md = require('node-markdown').Markdown;

var Config = require('../../../../config/globalconfig');
var config = new Config();

var Logger = require('../../../../config/logconfig');
var logger = new Logger().getLogger();



var getModule = function(callback){
    request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
                callback(null,returnData.data.modules);
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



router.get('/getArticleDetail',function(req,res,next){

    logger.debug("article id = " + req.query.id);

    async.parallel({
        article:function(callback){
            request(config.getBackendUrlPrefix() + "article/find-article-by-id?id=" + req.query.id,function(error,response,body){
                var returnData = JSON.parse(body);
                if(returnData.statusCode == 0){
                    returnData.data.article.content = md(returnData.data.article.content);
                    callback(null,returnData.data.article);
                } else {
                    logger.error("visitor/article.js -- /getArticleDetail fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                }
            });
        },
        modules:function(callback){
            getModule(callback);
        }
    },function(err,results){
        if(err == null){
            res.render('visitor/v3/learning/articleDetail',{'data':results});
        } else {
            logger.error(err.stack);
            res.render('error/unknowerror');
        }
    })
});


router.get('/get-random-article',function(req,res,next){
    async.parallel({
        article:function(callback){
            request(config.getBackendUrlPrefix() + "article/find-random-article",function(error,response,body){
                var returnData = JSON.parse(body);
                if(returnData.statusCode == 0){
                    var article = returnData.data.article;
                    article.content = md(article.content);
                    callback(null,returnData.data.article);
                } else {
                    logger.error("visitor/article.js -- /get-random-article fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                }
            });
        },
        modules:function(callback){
            getModule(callback);
        }
    },function(err,results){
        if(err == null){
            res.render('visitor/v3/learning/articleDetail',{'data':results});
        } else {
            logger.error(err.stack);
            res.render('error/unknowerror');
        }
    })
})


/**
 *  分页查询文章列表
 */
router.get('/page',function(req,res,next){
    var pageNum = req.query.pagenum;
    var moduleid = req.query.moduleid;
    var tagid = req.query.tagid;

    logger.debug("pageNum = " + pageNum + " ,moduleid = " + moduleid + " ,tagid = " + tagid);

    async.parallel({
        modules: function(callback){
            getModule(callback);
        },
        tags: function(callback){
            request(config.getBackendUrlPrefix() + "tag/find-tags-by-moduleid?moduleid="+moduleid,function(error,response,body){
                var returnData = JSON.parse(body);
                if(returnData.statusCode == 0){
                    callback(null,returnData.data.tags);
                } else {
                    logger.error("visitor/v2/visitor_learning/article.js -- /page -- tag/find-tags-by-moduleid?moduleid= fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
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
            logger.debug("url = " + url);
            request(url,function(error,response,body){
                var returnData = JSON.parse(body);
                if(returnData.statusCode == 0){
                    callback(null,returnData.data);
                } else {
                    logger.error("visitor/v2/visitor_learning/article.js -- /page -- article/find-articles-by-moduleid?moduleid fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                }
            });
        }
    },function(err,result){
        if(err == null){
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
        } else {
            logger.error(err.stack);
            res.render('error/unknowerror');
        }
    });
})

module.exports = router;
