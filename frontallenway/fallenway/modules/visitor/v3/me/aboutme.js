var express = require('express');
var router = express.Router();

var Logger = require('../../../../config/logconfig');
var logger = new Logger().getLogger();

var request = require('request');

var Config = require('../../../../config/globalconfig');
var config = new Config();

router.get('',function(req,res,next){
    request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
                res.render('visitor/v4/me/aboutme',{"data":returnData.data});
            } else {
                logger.error("visitor/v2/visitor_learning/index.js -- module/find-all-modules fail ..." +
                    " returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            }
        } else {
            logger.error(error);
            res.render('error/unknowerror');
        }
    });
});

module.exports = router;
