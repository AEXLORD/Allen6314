var express = require('express');
var router = express.Router();

var request = require('request');
var async = require('async');

var Config = require('../../../config/globalconfig.js');
var config = new Config();

var MyCookies = require('../../../common_utils/mycookies.js');
var mycookies = new MyCookies();

var Logger = require('../../../config/logconfig.js');
var logger = new Logger().getLogger();


router.get('',function(req,res,next){
    var url = config.getBackendUrlPrefix() + "auth/tag/find-all-tags";
    var options = {
        url:url,
        headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
        }
    }
    request(options,function(error,response,body){
        if(error == null){
            var returnData = JSON.parse(body);

            if(returnData.statusCode != 0){
                logger.error("admin/tag.js -- auth/tag/find-all-tags fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            } else {
                res.render('admin/v5/tag/tagIndex',{'data':returnData.data});
            }
        } else {
            logger.error(err);
            res.render('error/unknowerror');
        }
    })
});


router.get('/get-articles-by-tag',function(req,res,next){
    var url = config.getBackendUrlPrefix() + "auth/article/find-articles-by-tagid?tagid=" + req.query.id;
    var options = {
        url:url,
        headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
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


router.post('/add-tag',function(req,res,next){
    var url = config.getBackendUrlPrefix() + "auth/tag/add-tag";
    var data = {name:req.body.name,moduleName:req.body.moduleName,type:req.body.tagType};
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


router.post('/delete-tag',function(req,res,next){
    var url = config.getBackendUrlPrefix() + "auth/tag/delete-tag-by-id";
    var data = {id:req.body.id};
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

module.exports = router;


