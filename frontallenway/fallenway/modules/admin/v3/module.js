var express = require('express');
var router = express.Router();
var request = require('request');

var Config = require('../../../config/globalconfig.js');
var config = new Config();

var MyCookies = require('../../../common_utils/mycookies.js');
var mycookies = new MyCookies();

var Logger = require('../../../config/logconfig.js');
var logger = new Logger().getLogger();

router.get('',function(req,res,next){
    var url = config.getBackendUrlPrefix() + "auth/module/find-all-modules";

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
                res.render('admin/v4/module/moduleIndex',{'data':data});
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
                res.render('admin/v4/login');
            } else {
                res.render('error/unknowerror');
            }
        }
    });
});




//添加 module
router.post('/add-module',function(req,res,next){
    var url = config.getBackendUrlPrefix() + "auth/module/add-module";
    var data = {id:req.body.id,name:req.body.name,weight:req.body.weight,link:req.body.link};

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
})



router.post('/delete-module',function(req,res,next){
    logger.info("id = " + req.body.id);

    var options = {
        url:config.getBackendUrlPrefix() + "auth/module/delete-module-by-id",
        headers:{
            'Authorization': "Bearer " + mycookies.getAdminAuthorizationCookie(req)
        },
        form:{"id":req.body.id}
    }

    request.post(options,function(error,response,body){
        if(!error && response.statusCode == 200 ){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
                res.end();
            } else {
                logger.error("admin/module.js -- /auth/module/delete-module fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            }
        } else {
            logger.error("admin/module.js --  /auth/module/delete-module fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("admin/module.js -- /auth/module/delete-module fail ..." +
                    "response.statuCode = " + response.statusCode + "..." +
                    "response.body = " + response.body);
            }
            res.render('error/unknowerror');
        }
    });
})


module.exports = router;
