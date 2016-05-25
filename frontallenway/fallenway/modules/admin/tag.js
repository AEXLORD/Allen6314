var express = require('express');
var router = express.Router();
var request = require('request');

var Config = require('../../config/globalconfig.js');
var config = new Config();

var MyCookies = require('../../config/mycookies.js');
var mycookies = new MyCookies();

var Logger = require('../../config/logconfig.js');
var logger = new Logger().getLogger();


//Tag首页 -- 查找全部的tag
router.get('',function(req,res,next){

    logger.debug("admin/tag.js -- auth/admin/tag ...");

    var cookies = mycookies.getMyCookies(req);
	if(cookies['Authorization'] == 'undefined'){
 		logger.info("cookies[Authorization] == undefined......");
		res.render('admin/login');
	} else {
        	doSendRequestFindAllTags(res,cookies);
    }
});




//Tag首页 -- 查找全部的tag
function doSendRequestFindAllTags(res,cookies){

    var url = config.getBackendUrlPrefix() + "auth/tag/find-all-tags";
	var options = {
        url:url,
        headers:{
            'Authorization': "Bearer " + cookies['Authorization']
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
                var path = "<li><a href = \"/admin/index\">Index</a></li>" +
                    "<li>Tag Manage</li>";

                var data = {
                    'tags':returnData.data.tags,
                    'path':path
                }
               	res.render('admin/tag/tagIndex',{'data':data});
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
    });
}




//查找所有文章 -- 根据 tag
router.get('/get-articles-by-tag',function(req,res,next){

    logger.debug("admin/tag.js -- auth/article/get-articles-by-tag ...");

    var cookies = mycookies.getMyCookies(req);
	if(cookies['Authorization'] == 'undefined'){
 		logger.info("cookies[Authorization] == undefined......");
		res.render('admin/login');
	} else {

        var url = config.getBackendUrlPrefix() + "auth/article/find-articles-by-tag/" + req.query.id;
	    var options = {
            url:url,
            headers:{
                'Authorization': "Bearer " + cookies['Authorization']
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
    }
})





//添加 tag
router.post('/add-tag',function(req,res,next){
    logger.debug("admin/tag.js -- auth/admin/tag/add-tag ...");

    var cookies = mycookies.getMyCookies(req);
    if(cookies['Authorization'] == 'undefined'){
 		logger.info("cookies[Authorization] == undefined......");
		res.render('admin/login');
	} else {

        var url = config.getBackendUrlPrefix() + "auth/tag/add-tag";
        var data = {name:req.body.name};

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
    }
})




//删除 tag
router.post('/delete-tag',function(req,res,next){
    logger.debug("admin/tag.js -- /admin/tag/delete-tag ...");
    logger.debug("id = " + req.body.id);

    var cookies = mycookies.getMyCookies(req);
    if(cookies['Authorization'] == 'undefined'){
 		logger.info("cookies[Authorization] == undefined......");
		res.render('admin/login');
	} else {

        var url = config.getBackendUrlPrefix() + "auth/tag/delete-tag";
        var data = {id:req.body.id};

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
    }
})


module.exports = router;


