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

//添加tag
router.post('/new',function(req,res,next){
    var url = serverConstant.getBackendUrlPrefix() + "/auth/tag/new";
	var data = {
            'id':req.body.id,
            'name': req.body.tagName,
        	'moduleId': req.body.moduleId,
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
        res.status(200).end();
   	});
});


//修改tag -- 跳到修改tag页面
router.get('/update/:id',function(req,res,next){

    var id = req.params.id;

    var urlTags = serverConstant.getBackendUrlPrefix() + "/tag/findall";
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

//删除tag
router.post('/delete',function(req,res,next){
    var url = serverConstant.getBackendUrlPrefix() + "/auth/tag/delete";
	var data = {
            'id':req.body.id
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

//tag管理首页
router.get('/index',function(req,res,next){

    var url = serverConstant.getBackendUrlPrefix() + "/module";
    var url1 = serverConstant.getBackendUrlPrefix() + "/tag/findall";
    var options = {
        url:url,
        headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
        },
    }
    var options1 = {
        url:url1,
        headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
        },
    }

    async.parallel({
        modules:function(callback) {
            request(options,function(error,response,body){
                if(error != null){
                    logger.error(err);
                    res.render('error/unknowerror');
                }

                var returnData = JSON.parse(body);
                if(returnData.statusCode != 0){
                    logger.error("url = " + url + " -- returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                }
                callback(null,returnData.data);
            });
        },
        tags:function(callback) {
            request(options1,function(error,response,body){
                if(error != null){
                    logger.error(err);
                    res.render('error/unknowerror');
                }

                var returnData = JSON.parse(body);
                if(returnData.statusCode != 0){
                    logger.error("url = " + url + " -- returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                }
                callback(null,returnData.data);
            });
        }
    },
    function(err, results) {
        logger.info(results);
        res.render('admin/tag/index',{'data':results});
    });
});

//得到 tag 底下的文章
router.get('/articles',function(req,res,next){

    var tagId = req.query.id;

    var url = serverConstant.getBackendUrlPrefix() + "/tag/" + tagId + "/articles";
	var data = {
            'tagId':tagId
    	}
    var options = {
    	url:url,
    	headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
		},
	    form:data
    }
    request(options,function(error,response,body){
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
        res.json(returnData.data).status(200).end();
   	});

})

module.exports = router;
