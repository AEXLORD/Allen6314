var express = require('express');
var router = express.Router();
var request = require('request');

var async = require('async');
var md = require('node-markdown').Markdown;

var Config = require('../../../../config/globalconfig');
var config = new Config();

var Logger = require('../../../../config/logconfig');
var logger = new Logger().getLogger();


router.get('/getArticleDetail',function(req,res,next){
    logger.debug("article id = " + req.query.id);
    var url = config.getBackendUrlPrefix() + "article/find-article-by-id?id=" + req.query.id;
    request(url,function(error,response,body){
        if(error == null){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
                returnData.data.article.content = md(returnData.data.article.content);
                res.render('visitor/v5/learning/articleDetail',{'data':returnData.data});
            } else {
                logger.error("visitor/v5/learning/article.js -- /getArticleDetail fail ..." +
                    " returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            }
        } else {
            logger.error(error);
            res.render('error/unknowerror');
        }
    });
});


router.get('/get-random-article',function(req,res,next){
    var url = config.getBackendUrlPrefix() + "article/find-random-article";
    request(url,function(error,response,body){
        if(error == null){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
                var article = returnData.data.article;
                article.content = md(article.content);
                res.render('visitor/v5/learning/articleDetail',{'data':returnData.data});
            } else {
                logger.error("visitor/article.js -- /get-random-article fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            }
        } else {
            logger.error(error);
            res.render('error/unknowerror');
        }
    });
})


router.get('/page',function(req,res,next){
    var pageNum = req.query.pagenum;
    var moduleName = req.query.moduleName;
    var tagid = req.query.tagid;

    logger.debug("pageNum = " + pageNum + " ,moduleName = " + moduleName + " ,tagid = " + tagid);

    async.parallel({
        tags: function(callback){
            var url = config.getBackendUrlPrefix() + "tag/find-tags-by-moduleName?moduleName=learning";
            request(url,function(error,response,body){
                var returnData = JSON.parse(body);
                if(returnData.statusCode == 0){
                    callback(null,returnData.data.tags);
                } else {
                    logger.error("visitor/v5/learning/article.js -- /page -- tag/find-tags-by-moduleName?moduleName=learning fail ..." +
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
                url = config.getBackendUrlPrefix() + "article/find-articles-by-moduleName?moduleName=learning" +
                        "&page=" + pageNum + "&size=" + pageSize;
            }
            request(url,function(error,response,body){
                var returnData = JSON.parse(body);
                if(returnData.statusCode == 0){
                    callback(null,returnData.data);
                } else {
                    logger.error("visitor/v5/learning/article.js -- /page -- article/find-articles-by-moduleName?moduleName=learning fail ..." +
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
            result.moduleName = "learning";
            result.tagid = tagid;
            res.render('visitor/v5/learning/index',{'data':result});
        } else {
            logger.error(err);
            res.render('error/unknowerror');
        }
    });
})


router.post('/vote',function(req,res,next){
    logger.info("type = " + req.body.type);
    logger.info("articleId = " + req.body.articleId);

    var url = config.getBackendUrlPrefix() + "article/vote";
	var data = {
            'id': req.body.articleId,
        	'type': req.body.type,
    	}
    var options = {
    	url:url,
	    form:data
    }
    request.post(options,function(error,response,body){
        if(!error && response.statusCode == 200 ){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
                res.end();
            } else {
			    logger.log("visitor/learning/article.js -- /vote -- response.statusCode = 200, returnData.statusCode != 0 ");
                res.status(500).end();
            }
        } else {
            logger.error("visitor/learning/article.js -- /vote --  ..." + "error = " + error);
            res.status(500).end();
		}
   	});
});


module.exports = router;
