var express = require('express');
var router = express.Router();

var request = require('request');
var async = require('async');

var Config = require('../../config/globalconfig.js');
var config = new Config();

var MyCookies = require('../../common_utils/mycookies.js');
var mycookies = new MyCookies();

var Logger = require('../../config/logconfig.js');
var logger = new Logger().getLogger();


router.get('',function(req,res,next){
    async.waterfall([
        //请求全部tags
        function(callback){
            var url = config.getBackendUrlPrefix() + "auth/tag/find-all-tags";
	        var options = {
                    url:url,
                    headers:{
                        'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie()
                    }
            }

            request(options,function(error,response,body){
                if(!error && response.statusCode == 200){
                    var returnData = JSON.parse(body);

                    if(returnData.statusCode != 0){
                        logger.error("admin/tag.js -- auth/tag/find-all-tags fail ..." +
                            "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
                     } else {
                        callback(null,returnData.data);
                    }
                } else {
                    logger.error("admin/tag.js -- auth/tag/find-all-tags fail ..." +
                        "error = " + error);
                    if(response != null){
                        logger.error("admin/tag.js -- auth/tag/find-all-tags fail ..." +
                            "response.statuCode = " + response.statusCode + "..." +
                            "response.body = " + response.body);
                    }
                    res.render('error/unknowerror');
                }
            })
            //请求module
        },function(data,callback){
            var url = config.getBackendUrlPrefix() + "auth/module/find-all-modules";
	        var options = {
                    url:url,
                    headers:{
                        'Authorization': "Bearer " + cookies[AdminAuthorization]
                    }
            }
            request(options,function(error,response,body){
                if(!error && response.statusCode == 200 ){
                    var returnData = JSON.parse(body);
                    if(returnData.statusCode == 0){
                        data.modules = returnData.data.modules;
                        callback(null,data);
                    } else {
                        logger.error("admin/tag.js -- auth/tag/find-all-modules fail ..." +
                            "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
                    }
                } else {
                    logger.error("admin/tag.js -- auth/tag/find-all-modules ..." +
                        "error = " + error);
                    if(response != null){
                        logger.error("admin/tag.js --auth/tag/find-all-modules fail ..." +
                            "response.statuCode = " + response.statusCode + "..." +
                            "response.body = " + response.body);
                    }
                    res.render('error/unknowerror');
                }
            });
        }
    ],function(err,result){
        var path = "<li><a href = \"/admin/index\">Index</a></li>" +
                "<li>Tag Manage</li>";

        result.path = path;
        res.render('admin/tag/tagIndex',{'data':result});
    })
});




//查找所有文章 -- 根据 tag
router.get('/get-articles-by-tag',function(req,res,next){
    var url = config.getBackendUrlPrefix() + "auth/article/find-articles-by-tagid?tagid=" + req.query.id;
    var options = {
        url:url,
        headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie()
        }
    }
    request(options,function(error,response,body){
        if(!error && response.statusCode == 200){
    		var returnData = JSON.parse(body);
            if(returnData.statusCode != 0){
                logger.error("admin/tag.js -- auth/admin/tag/get-articles-by-tag fail ..." +
                        "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
        	} else {
       	 		res.send({'articles':returnData.data.articles});
            }
        } else {
            logger.error("admin/tag.js -- auth/admin/tag/get-articles-by-tag fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("admin/tag.js -- auth/admin/tag/get-articles-by-tag fail ..." +
                    "response.statuCode = " + response.statusCode + "..." +
                    "response.body = " + response.body);
            }
            res.render('error/unknowerror');
    	}
	});
})




//添加 tag
router.post('/add-tag',function(req,res,next){
    var url = config.getBackendUrlPrefix() + "auth/tag/add-tag";
    var data = {name:req.body.name,moduleId:req.body.moduleId,type:req.body.tagType};
    var options = {
        url:url,
        headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie()
        },
        form:data
    }

    request.post(options,function(error,response,body){
        if(!error && response.statusCode == 200 ){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
                res.send({tag:returnData.data.tag});
		    } else {
                logger.error("admin/tag.js -- /auth/tag/add-tag fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            }
        } else {
            logger.error("admin/tag.js --  /auth/tag/add-tag fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("admin/tag.js -- /auth/tag/add-tag fail ..." +
                    "response.statuCode = " + response.statusCode + "..." +
                    "response.body = " + response.body);
            }
            res.render('error/unknowerror');
        }
    });
})




//删除 tag
router.post('/delete-tag',function(req,res,next){
    var url = config.getBackendUrlPrefix() + "auth/tag/delete-tag-by-id";
    var data = {id:req.body.id};
    var options = {
        url:url,
        headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie()
        },
        form:data
    }

    request.post(options,function(error,response,body){
        if(!error && response.statusCode == 200 ){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
                res.end();
		    } else {
                logger.error("admin/tag.js -- /auth/tag/delete-tag fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            }
        } else {
            logger.error("admin/tag.js --  /auth/tag/delete-tag fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("admin/tag.js -- /auth/tag/delete-tag fail ..." +
                    "response.statuCode = " + response.statusCode + "..." +
                    "response.body = " + response.body);
            }
            res.render('error/unknowerror');
        }
    });
})



router.get("/find-tagtype-by-moduleid",function(req,res,next){
    var url = config.getBackendUrlPrefix() + "auth/tag/find-tagtype-by-moduleid?moduleid=" + req.query.moduleid;

    var options = {
        url:url,
        headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie()
        },
    }

    request.get(options,function(error,response,body){
        if(!error && response.statusCode == 200 ){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
			    res.send({data:returnData.data});
		    } else {
                logger.error("admin/tag.js -- auth/tag/find-tagtype-by-moduleid fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            }
        } else {
            logger.error("admin/tag.js --  auth/tag/find-tagtype-by-moduleid fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("admin/tag.js -- auth/tag/find-tagtype-by-moduleid fail ..." +
                    "response.statuCode = " + response.statusCode + "..." +
                    "response.body = " + response.body);
            }
            res.render('error/unknowerror');
        }
    });
})


module.exports = router;


