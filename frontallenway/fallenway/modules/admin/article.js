var express = require('express');
var router = express.Router();

var md = require('node-markdown').Markdown;
var request = require('request');
var async = require('async');

var Config = require('../../config/globalconfig.js');
var config = new Config();

var MyCookies = require('../../config/mycookies.js');
var mycookies = new MyCookies();

var Logger = require('../../config/logconfig.js');
var logger = new Logger().getLogger();



//添加文章 -- 跳到添加文章首页
router.get('/addArticle',function(req,res,next){

    logger.debug("admin/article.js -- /admin/addArticle ...");

    var cookies = mycookies.getMyCookies(req);
	if(cookies['Authorization'] == 'undefined'){
 		logger.info("cookies[Authorization] == undefined......");
		res.render('admin/login');
	} else {
        	doSendRequestGetAddArticleRequiredParams(res,cookies);
    }
});


//添加文章 -- 获得添加文章的一些参数
function doSendRequestGetAddArticleRequiredParams(res,cookies){

    var urlTags = config.getBackendUrlPrefix() + "auth/tag/find-all-tags";
	var optionsTags = {
        url:urlTags,
        headers:{
            'Authorization': "Bearer " + cookies['Authorization']
        }
    }

    async.waterfall([
        //请求tags
        function(callback){
            request(optionsTags,function(error,response,body){
                if(!error && response.statusCode == 200 ){
                    var returnData = JSON.parse(body);
                    if(returnData.statusCode == 0){
                        callback(null,returnData.data);
                    } else {
                        logger.error("admin/article.js -- auth/tag/find-all-tags fail ..." +
                                "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
                    }
                } else {
                    logger.error("admin/article.js -- auth/tag/find-all-tags fail ..." +
                            "error = " + error);
                    if(response != null){
                        logger.error("admin/article.js -- auth/tag/find-all-tags fail ..." +
                                "response.statuCode = " + response.statusCode + "..." +
                                "response.body = " + response.body);
                    }
                    res.render('error/unknowerror');
                }
            });
        }
    ],function(err,result){
        var path = "<li><a href = \"/admin/index\">Index</a></li>" +
                "<li><a href = \"/admin/article/articleManage\">Article Manage</a></li>" +
                "<li><a href = \"#\" class = \"active\">Add Article</a></li>";
        result.path = path;
        res.render('admin/article/add_updateArticle',{'data':result});
    })
}



//添加文章 -- 获得添加文章的一些参数
router.post('/addArticle/doAdd',function(req,res,next){

    logger.debug("admin/article.js -- /admin/addArticle/doAdd ...");

    var cookies = mycookies.getMyCookies(req);
    	if(cookies['Authorization'] == 'undefined'){
 		logger.info("cookies[Authorization] == undefined......");
		res.render('admin/login');
	} else {
		doSendRequestDoAdd(res,req,cookies);
	}
});




//添加文章 -- 获得添加文章的一些参数
function doSendRequestDoAdd(res,req,cookies){
    var url = config.getBackendUrlPrefix() + "auth/article/save-article";
	var data = {
            'id': req.body.id,
        	'title': req.body.title,
         	'content': req.body.mdData,
         	'tagId': req.body.tagId,
    	}

    var cookies = mycookies.getMyCookies(req);
    var options = {
    	url:url,
    	headers:{
            'Authorization': "Bearer " + cookies['Authorization']
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
			    res.render('admin/login');
		    } else {
                res.render('error/unknowerror');
			}
		}
   	});
}





//删除文章
router.get('/deleteArticle',function(req,res,next){

    logger.debug("admin/article.js -- /admin/deleteArticle ...");

    var cookies = mycookies.getMyCookies(req);
    if(cookies['Authorization'] == 'undefined'){
 		logger.info("cookies[Authorization] == undefined......");
		res.render('admin/login');
	} else {
		var url = config.getBackendUrlPrefix() + "auth/article/delete-article-by-id";
    	var data = {id:req.query.id};

		var options = {
        		url:url,
        		headers:{
                		'Authorization': "Bearer " + cookies['Authorization']
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
	}
});




//修改文章 -- 跳到修改文章页面
router.get('/modifyArticle',function(req,res,next){

    logger.debug("admin/article.js -- auth/admin/modifyArticle ...");

    var cookies = mycookies.getMyCookies(req);
    if(cookies['Authorization'] == 'undefined'){
 		logger.info("cookies[Authorization] == undefined......");
        res.render('admin/login');
    } else {
        doSendRequestGetModifyArticleRequiredParams(req,res,cookies);
	}
});





//修改文章 -- 获得修改文章的一些参数
function doSendRequestGetModifyArticleRequiredParams(req,res,cookies){

	var urlTags = config.getBackendUrlPrefix() + "auth/tag/find-all-tags";
	var optionsTags = {
        url:urlTags,
        headers:{
            'Authorization': "Bearer " + cookies['Authorization']
        }
    }

	var urlFindArticle = config.getBackendUrlPrefix() + "auth/article/find-article-by-id?id=" + req.query.id;
	var optionFindArticle = {
        url:urlFindArticle,
        headers:{
            'Authorization': "Bearer " + cookies['Authorization']
        }
    }

    async.waterfall([
        //请求tags
       function(callback){
            request(optionsTags,function(error,response,body){
                if(!error && response.statusCode == 200 ){
                    var returnData = JSON.parse(body);
                    if(returnData.statusCode == 0){
                        callback(null,returnData.data);
                    } else {
                        logger.error("admin/article.js -- auth/tag/find-all-tags fail ..." +
                            "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
                    }
                } else {
                    logger.error("admin/article.js -- auth/tag/find-all-tags fail ..." +
                        "error = " + error);
                    if(response != null){
                        logger.error("admin/article.js -- auth/tag/find-all-tags fail ..." +
                            "response.statuCode = " + response.statusCode + "..." +
                            "response.body = " + response.body);
                    }
                    res.render('error/unknowerror');
                }
            });
        },function(data,callback){
            request(optionFindArticle,function(error,response,body){
                if(!error && response.statusCode == 200 ){
                    var returnData = JSON.parse(body);
                    if(returnData.statusCode == 0){
                        data.article = returnData.data.article;
                        callback(null,data);
                    } else {
                        logger.error("admin/article.js -- auth/article/find-article-by-id?id=xx fail ..." +
                            "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
                    }
                } else {
                    logger.error("admin/article.js -- auth/article/find-article-by-id?id=xx ..." +
                        "error = " + error);
                    if(response != null){
                        logger.error("admin/article.js --auth/article/find-article-by-id?id=xx fail ..." +
                            "response.statuCode = " + response.statusCode + "..." +
                            "response.body = " + response.body);
                    }
                    res.render('error/unknowerror');
                }
            });
        }
    	],function(err,result){
        	res.render('admin/article/add_updateArticle',{'data':result});
	})
}




//文章管理首页
router.get('/articleManage',function(req,res,next){
    logger.debug("admin/article.js -- /admin/articleManage ...");


    var cookies = mycookies.getMyCookies(req);
    if(cookies['Authorization'] == 'undefined'){
 		logger.info("cookies[Authorization] == undefined......");
        res.render('admin/login');
    } else {
        var moduleid;
        async.waterfall([
                function(callback){
                    request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
                        if(!error && response.statusCode == 200){
                            var returnData = JSON.parse(body);

                            if(returnData.statusCode != 0){
                                logger.error("admin/artice.js -- module/find-all-modules fail ..." +
                                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                                res.render('error/unknowerror');
                            } else {
                                callback(null,returnData.data);
                            }
                        } else {
                            logger.error("admin/article.js -- module/find-all-modules fail ..." +
                                    "error = " + error);
                            if(response != null){
                                logger.error("admin/article.js -- module/find-all-modules fail ..." +
                                    "response.statuCode = " + response.statusCode + "..." +
                                    "response.body = " + response.body);
                            }
                            res.render('error/unknowerror');
                        }
                    });
                },
                function(data,callback){
                    var modules = data.modules;

                    modules.forEach(function(entry){
                        if(entry.name == "Learning"){
                            moduleid = entry.id;
                        }
                    })

                    var pageSize = config.getPageSize();
                    var url = config.getBackendUrlPrefix() + "article/find-articles-by-moduleid?moduleid=" +
                                    moduleid + "&page=1&size=" + pageSize;
                    request(url,function(error,response,body){
                        if(!error && response.statusCode == 200){
                            var returnData = JSON.parse(body);

                            if(returnData.statusCode != 0){
                                logger.error("admin/article.js -- article/find-articles-by-moduleid?moduleid fail ..." +
                                   "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                                res.render('error/unknowerror');
                            } else {
                                data.articles = returnData.data.articles;
                                data.totalPage = new Array();

                                for(var i = 1; i <= returnData.data.totalPage;i++){
                                    data.totalPage[i-1] = i;
                                }
                                callback(null,data);
                            }
                        } else {
                            logger.error("admin/article.js -- article/find-articles-by-moduleid?moduleid fail ..." +
                                "error = " + error);
                            if(response != null){
                                logger.error("admin/article.js -- article/find-articles-by-moduleid?moduleid fail ..." +
                                   "response.statuCode = " + response.statusCode + "..." +
                                   "response.body = " + response.body);
                            }
                            res.render('error/unknowerror');
                        }
                    });
                }
        ],function(err,result){
            result.nowPageLeft = 0;
            result.nowPage = 1;
            result.nowPageRight = 2;
            result.moduleid =  moduleid;
            res.render('admin/article/articleManageIndex',{'data':result});
        });
    }
});




router.get('/page',function(req,res,next){
    var pageNum = req.query.pagenum;
    var moduleid = req.query.moduleid;
    var tagid = req.query.tagid;

    async.parallel({
        modules: function(callback){
            request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
                if(!error && response.statusCode == 200){
                    var returnData = JSON.parse(body);

                    if(returnData.statusCode != 0){
                        logger.error("admin/article.js -- module/find-all-modules fail ..." +
                            "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
                    } else {
                        callback(null, returnData.data.modules);
                    }
                } else {
                    logger.error("admin/article.js -- module/find-all-modules fail ..." +
                            "error = " + error);
                    if(response != null){
                        logger.error("admin/article.js -- module/find-all-modules fail ..." +
                            "response.statuCode = " + response.statusCode + "..." +
                            "response.body = " + response.body);
                    }
                    res.render('error/unknowerror');
                }
            });
        },
        articles_totalPage: function(callback){

            var url;
            var pageSize = config.getPageSize();

            if(tagid != ""){
                url = config.getBackendUrlPrefix() + "article/find-articles-by-tagid?tagId=" +
                        tagid + "&page="+ pageNum +"&size=" + pageSize;
            } else {
                url = config.getBackendUrlPrefix() + "article/find-articles-by-moduleid?moduleid=" +
                        moduleid + "&page=" + pageNum + "&size=" + pageSize;
            }

            request(url,function(error,response,body){
                if(!error && response.statusCode == 200){
                    var returnData = JSON.parse(body);

                    if(returnData.statusCode != 0){
                        logger.error("admin/article.js -- article/find-articles-by-moduleid?moduleid fail ..." +
                            "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
                    } else {
                        callback(null,returnData.data);
                    }
                } else {
                    logger.error("admin/article.js -- article/find-articles-by-moduleid?moduleid fail ..." +
                        "error = " + error);
                    if(response != null){
                        logger.error("admin/article.js -- article/find-articles-by-moduleid?moduleid fail ..." +
                            "response.statuCode = " + response.statusCode + "..." +
                            "response.body = " + response.body);
                    }
                    res.render('error/unknowerror');
                }
            });
        }

    },function(err,result){
        result.articles = result.articles_totalPage.articles;
        result.totalPage = new Array();

        for(var i = 1; i <= result.articles_totalPage.totalPage;i++){
            result.totalPage[i-1] = i;
        }

        result.nowPageLeft = parseInt(pageNum) - 1;
        result.nowPage = pageNum;
        result.nowPageRight = parseInt(pageNum) + 1;
        result.moduleid = moduleid;

        res.render('admin/article/articleManageIndex',{'data':result});
    })
});



module.exports = router;
