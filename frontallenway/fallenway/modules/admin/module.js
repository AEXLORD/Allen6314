var express = require('express');
var router = express.Router();
var request = require('request');

var Config = require('../../config/globalconfig.js');
var config = new Config();

var MyCookies = require('../../config/mycookies.js');
var mycookies = new MyCookies();

var Logger = require('../../config/logconfig.js');
var logger = new Logger().getLogger();

router.get('',function(req,res,next){

    logger.debug("admin/module.js -- /admin/module ...");

    var cookies = mycookies.getMyCookies(req);
    if(cookies['Authorization'] == 'undefined'){
 		logger.info("cookies[Authorization] == undefined......");
        res.render('admin/login');
    } else {
        doSendRequestGetAllModules(res,cookies);
    }
});

function doSendRequestGetAllModules(res,cookies){
    var url = config.getBackendUrlPrefix() + "auth/module/find-all-modules";

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
                logger.error("admin/article.js -- auth/bug/get-all-bugs fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
	        } else {
                var path = "<li><a href = \"/admin/index\">Index</a></li>" +
                "<li>Module Manage</li>";

                var data = {
                    'modules':returnData.data.modules,
                    'path':path
                }
                res.render('admin/module/moduleIndex',{'data':data});
            }
        } else {
            logger.error("admin/module.js -- auth/module/find-all-modules fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("admin/module.js -- auth/module/find-all-bugs fail ..." +
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




//添加 module
router.post('/add-module',function(req,res,next){
    logger.debug("admin/module.js -- auth/admin/module/add-module ...");

    var cookies = mycookies.getMyCookies(req);
    if(cookies['Authorization'] == 'undefined'){
 		logger.info("cookies[Authorization] == undefined......");
		res.render('admin/login');
	} else {

        var url = config.getBackendUrlPrefix() + "auth/module/add-module";
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
			        res.send({module:returnData.data.module});
		        } else {
                    logger.error("admin/module.js -- /auth/module/add-module fail ..." +
                        "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
        	    }
            } else {
                logger.error("admin/module.js --  /auth/module/add-module fail ..." +
                    "error = " + error);
                if(response != null){
                    logger.error("admin/module.js -- /auth/module/add-module fail ..." +
                        "response.statuCode = " + response.statusCode + "..." +
                        "response.body = " + response.body);
                }
                res.render('error/unknowerror');
    	    }
	    });
    }
})


module.exports = router;


