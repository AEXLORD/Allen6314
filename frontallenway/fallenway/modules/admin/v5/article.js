var express = require('express');
var router = express.Router();

var md = require('node-markdown').Markdown;
var request = require('request');
var async = require('async');

var Config = require('../../../config/globalconfig.js');
var config = new Config();

var MyCookies = require('../../../common_utils/mycookies.js');
var mycookies = new MyCookies();

var Logger = require('../../../config/logconfig.js');
var logger = new Logger().getLogger();



//添加文章 -- 跳到添加文章首页
router.get('/addArticle',function(req,res,next){
    var moduleName = req.query.moduleName;
    if(moduleName == null) moduleName == "learning";

    logger.info("moduleName = " + moduleName);
    if(moduleName != "learning"){
        var data = {};
        data.moduleName = moduleName;
        res.render('admin/v5/article/add_updateArticle',{'data':data});
    } else {
        var urlTags = config.getBackendUrlPrefix() + "auth/tag/find-all-tags";
	    var optionsTags = {
            url:urlTags,
            headers:{
                'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
            }
        }
        request(optionsTags,function(error,response,body){
            if(error == null) {
                var returndata = JSON.parse(body);
                if(returndata.statusCode == 0){
                    var data = returndata.data.tags;
                    data.moduleName = moduleName;
                    res.render('admin/v5/article/add_updateArticle',{'data':data});
                } else {
                    logger.error("admin/article.js -- auth/tag/find-all-tags fail ..." +
                            "response.statuscode = 200, but returndata.statuscode = " + returndata.statuscode);
                    res.render('error/unknowerror');
                }
            } else {
                logger.error(error);
                res.render('error/unknowerror');
            }
        });
    }
});




//添加文章
router.post('/addArticle/doAdd',function(req,res,next){

    logger.info("id = " + req.body.id);
    logger.info("title = " + req.body.title);
    logger.info("content = " + req.body.mdData);
    logger.info("tagId = " + req.body.tagId);
    logger.info("isTop = " + req.body.isTop);
    logger.info("moduleName = " + req.body.moduleName);

    var url = config.getBackendUrlPrefix() + "auth/article/save-article";
	var data = {
            'id': req.body.id,
        	'title': req.body.title,
         	'content': req.body.mdData,
         	'tagId': req.body.tagId,
         	'isTop': req.body.isTop,
         	'moduleName': req.body.moduleName,
    	}
    var options = {
    	url:url,
    	headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
		},
	    form:data
    }
    request.post(options,function(error,response,body){
        if(!error && response.statusCode == 200 ){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
                res.redirect('/admin/article/articleManage');
            } else {
			    logger.log("unknow error in kong or java,because response.statusCode = 200, returnData.statusCode != 0 ");
            }
        } else {
            logger.error("admin/article.js -- auth/article/save-article ..." +
                "error = " + error);
            if(response != null){
                logger.error("admin/article.js -- auth/article/save-article fail ..." +
                    "response.statuCode = " + response.statusCode + "..." +
                    "response.body = " + response.body);
            }
        	if(response.statusCode == 401){
			    res.render('admin/v5/login');
		    } else {
                res.render('error/unknowerror');
			}
		}
   	});
});



//删除文章
router.get('/deleteArticle',function(req,res,next){
    var url = config.getBackendUrlPrefix() + "auth/article/delete-article-by-id";
    var data = {id:req.query.id};
    var options = {
        url:url,
            headers:{
                'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
            },
        form:data
    }
    request.post(options,function(error,response,body){
        if(!error && response.statusCode == 200 ){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
                res.redirect('/admin/article/articleManage');
            } else {
                logger.error("admin/article.js -- auth/admin/deleteArticle fail ..." +
                        "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            }
        } else {
            logger.error("admin/article.js -- auth/admin/deleteArticle fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("admin/article.js -- auth/admin/deleteArticle fail ..." +
                    "response.statuCode = " + response.statusCode + "..." +
                    "response.body = " + response.body);
            }
            res.render('error/unknowerror');
        }
    });
});




//修改文章 -- 跳到修改文章页面
router.get('/modifyArticle',function(req,res,next){

    var moduleName = req.query.moduleName;
    if(moduleName == null) moduleName = "learning";

    var urlTags = config.getBackendUrlPrefix() + "auth/tag/find-all-tags";
	var optionsTags = {
        url:urlTags,
        headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
        }
    }
	var urlFindArticle = config.getBackendUrlPrefix() + "auth/article/find-article-by-id?id=" + req.query.id;
	var optionFindArticle = {
        url:urlFindArticle,
        headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
        }
    }
    async.waterfall([
        //请求tags
       function(callback){
           if(moduleName == "learning"){
               request(optionsTags,function(error,response,body){
                   var returnData = JSON.parse(body);
                   if(returnData.statusCode == 0){
                       callback(null,returnData.data);
                   } else {
                       logger.error("admin/article.js -- auth/tag/find-all-tags fail ..." +
                           "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                       res.render('error/unknowerror');
                   }
               });
           } else {
               callback(null,null);
           }
       },function(data,callback){
            request(optionFindArticle,function(error,response,body){
                var returnData = JSON.parse(body);
                if(returnData.statusCode == 0){
                    if(data == null) data = {};
                    data.article = returnData.data.article;
                    callback(null,data);
                } else {
                    logger.error("admin/article.js -- auth/article/find-article-by-id?id=xx fail ..." +
                        "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                }
            });
        }],
    function(err,result){
        if(!err){
            result.moduleName = moduleName;
            res.render('admin/v5/article/add_updateArticle',{'data':result});
        } else {
            logger.error(err.stack);
            res.render('error/unknowerror');
        }
    })
});




//文章管理首页
router.get('/articleManage',function(req,res,next){
    var moduleName = req.query.moduleName;
    if(moduleName == null) moduleName = "learning";
    var pageSize = config.getArticleListPageSize();
    var url = config.getBackendUrlPrefix() + "auth/article/find-articles-by-moduleName?moduleName=" + moduleName +
                "&page=1&size=" + pageSize;
    var options = {
        url:url,
        headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
        },
    }
    request(options,function(error,response,body){
        if(error == null){
            var returnData = JSON.parse(body);
            if(returnData.statusCode != 0){
                logger.error("admin/article.js -- auth/article/find-articles-by-moduleName?moduleName fail ..." +
                   "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            } else {
                var data = {};
                data.articles = returnData.data.articles;
                data.totalPage = new Array();
                for(var i = 1; i <= returnData.data.totalPage;i++){
                    data.totalPage[i-1] = i;
                }
                data.nowPageLeft = 0;
                data.nowPage = 1;
                data.nowPageRight = 2;
                data.moduleName = moduleName;
                res.render('admin/v5/article/articleManageIndex',{'data':data});
            }
        } else {
            logger.error(err);
            res.render('error/unknowerror');
        }
    });
});




router.get('/page',function(req,res,next){
    var moduleName = req.query.moduleName;
    if(moduleName == null) moduleName = "learning";
    var pageNum = req.query.pagenum;
    var tagid = req.query.tagid;
    var url;
    var pageSize = config.getArticleListPageSize();
    if(tagid != ""){
        url = config.getBackendUrlPrefix() + "auth/article/find-articles-by-tagid?tagId=" +
                tagid + "&page="+ pageNum +"&size=" + pageSize;
    } else {
        url = config.getBackendUrlPrefix() + "auth/article/find-articles-by-moduleName?moduleName=" + moduleName +
                "&page=" + pageNum + "&size=" + pageSize;
    }
    var options = {
        url:url,
        headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
	    },
    }
    request(options,function(error,response,body){
        if(error == null){
            var returnData = JSON.parse(body);
            if(returnData.statusCode != 0){
                logger.error("admin/article.js -- auth/article/find-articles-by-moduleName?moduleName fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            } else {
                var result = {};
                result.articles = returnData.data.articles;
                result.totalPage = new Array();
                for(var i = 1; i <= returnData.data.totalPage;i++){
                    result.totalPage[i-1] = i;
                }
                result.nowPageLeft = parseInt(pageNum) - 1;
                result.nowPage = pageNum;
                result.nowPageRight = parseInt(pageNum) + 1;
                result.moduleName = moduleName;
                res.render('admin/v5/article/articleManageIndex',{'data':result});
            }
        } else {
            logger.error(err);
            res.render('error/unknowerror');
        }
    });
});


module.exports = router;
