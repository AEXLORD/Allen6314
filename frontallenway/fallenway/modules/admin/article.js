var express = require('express');
var router = express.Router();

var md = require('node-markdown').Markdown;
var request = require('request');
var async = require('async');

var ServerConstant = require('../../commons/constant/ServerConstant.js');
var serverConstant = new ServerConstant();

var MyCookies = require('../../utils/mycookies.js');
var mycookies = new MyCookies();

var Logger = require('../../infrustructure/log/logconfig.js');
var logger = new Logger().getLogger();

var ExceptionCode = require('../../commons/exception/ExceptionCode.js');
var exceptionCode = new ExceptionCode();
//添加文章 -- 跳到添加文章首页
router.get('/tonew',function(req,res,next){
    var url = serverConstant.getBackendUrlPrefix() + "/auth/tag/findall";
    var options = {
            url:url,
            headers:{
                'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
            }
    }
    request(options,function(error,response,body){
        if(error != null) {
            logger.error(error);
            res.render('error/unknowerror');
        }

        var returnData = JSON.parse(body);

        if(returnData.statusCode != 0){
            logger.error("url = " + url + " -- returnData.statuCode = " + returnData.statusCode);
            res.render('error/unknowerror');
        }

        var data = {};
        data.tags = returnData.data;

        res.render('admin/article/update',{'data':data});
    });
});

//添加文章
router.post('/donew',function(req,res,next){

    var url = serverConstant.getBackendUrlPrefix() + "/auth/article/new";
	var data = {
            'id': req.body.id,
        	'title': req.body.title,
         	'content': req.body.mdData,
         	'tagId': req.body.tagId,
    	}
    var options = {
    	url:url,
    	headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
		},
	    form:data
    }
    request.post(options,function(error,response,body){
        if(error != null){
            logger.error(error);
            res.render('error/unknowerror');
        }

        var returnData = JSON.parse(body);

        if(returnData.statusCode != 0){
            if(response.statusCode == 401){
			    res.render('admin/login');
		    }
            logger.error("url = " + url + " -- returnData.statuCode = " + returnData.statusCode);
            res.render('error/unknowerror');
        }
        res.redirect('/admin/article/index');
   	});
});


//修改文章 -- 跳到修改文章页面
router.get('/update/:id',function(req,res,next){

    var id = req.params.id;

    var urlTags = serverConstant.getBackendUrlPrefix() + "/auth/tag/findall";
	var optionsTags = {
        url:urlTags,
        headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
        }
    }

	var urlArticle = serverConstant.getBackendUrlPrefix() + "/article/" + id;
	var optionsArticle = {
        url:urlArticle,
        headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
        }
    }
    async.waterfall([
        //请求tags
        function(callback){
            request(optionsTags,function(error,response,body){
                if(error != null){
                    callback(error,null);
                }

                var returnData = JSON.parse(body);
                if(returnData.statusCode != 0){
                    logger.error("url = " + urlTags + " -- returnData.statuCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                }
                var data = {};
                data.tags = returnData.data;
                callback(null,data);
            });
       },function(data,callback){
            request(optionsArticle,function(error,response,body){
                if(error != null){
                    callback(error,null);
                }

                var returnData = JSON.parse(body);

                if(returnData.statusCode != 0){
                    logger.error("url = " + urlArticle + " -- returnData.statuCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                }
                data.article = returnData.data;
                callback(null,data);
            });
        }],
    function(err,result){
        if(err != null){
            logger.error(err.stack);
            res.render('error/unknowerror');
        }
        res.render('admin/article/update',{'data':result});
    })
});

//文章管理首页
router.get('/index',function(req,res,next){
    var urlModule = serverConstant.getBackendUrlPrefix() + "/module";
    var optionsModule = {
        url:urlModule,
        headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
        },
    }
    var urlTag = serverConstant.getBackendUrlPrefix() + "/auth/tag/findall";
    var optionsTag = {
        url:urlTag,
        headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
        },
    }

    async.parallel({
        //请求所有 module
        modules:function(callback){
            request(optionsModule,function(error,response,body){

                if(error != null){
                    callback(error,null);
                }

                var returnData = JSON.parse(body);

                if(returnData.statusCode != 0){
                    res.render('error/unknowerror');
                    return ;
                }

                callback(null,returnData.data)
            });
        },
        //请求所有 tag
        tags:function(callback){
            request(optionsTag,function(error,response,body){
                if(error != null){
                    callback(error,null);
                }

                var returnData = JSON.parse(body);

                if(returnData.statusCode != 0){
                    res.render('error/unknowerror');
                    return ;
                }

                callback(null,returnData.data);
            });
        }
    },function(err,results){
        if(!err){
            res.render('admin/article/index',{'data':results});
        } else {
            logger.error(err.stack);
            res.render('error/unknowerror');
        }
    })
});


//修改文章状态，删除/恢复正常
router.post('/delete',function(req,res,next){
    var id = req.body.id;
    var status = req.body.status;

    if(id == null || id == "" || (status != "true" && status != "false")){
        res.status(exceptionCode.getParamIsInvalid()).end();
        return;
    }

    var url = serverConstant.getBackendUrlPrefix() + "/auth/article/delete";
	var data = {
            'id': id,
         	'status': status,
    	}
    var options = {
    	url:url,
    	headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
		},
	    form:data
    }
    request.post(options,function(error,response,body){
        if(error != null){
            logger.error(error);
            res.render('error/unknowerror');
        }

        var returnData = JSON.parse(body);

        if(returnData.statusCode != 0){
            if(response.statusCode == 401){
			    res.render('admin/login');
		    }
            logger.error("url = " + url + " -- returnData.statuCode = " + returnData.statusCode);
            res.status(returnData.statusCode).end();
        }
        res.status(200).end();
   	});
});

module.exports = router;
