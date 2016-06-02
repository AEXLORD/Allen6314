var express = require('express');
var router = express.Router();

var Logger = require('../../../../config/logconfig.js');
var logger = new Logger().getLogger();

var request = require('request');

var Config = require('../../../../config/globalconfig.js');
var config = new Config();

router.get('',function(req,res,next){

    logger.debug("visitor/v2/me/aboutme.js -- /visitor/aboutme ...");

    request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);

            if(returnData.statusCode != 0){
                logger.error("visitor/v2/visitor_learning/index.js -- module/find-all-modules fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            } else {
                res.render('visitor/v3/me/aboutme',{"data":returnData.data});
            }
        } else {
            logger.error("visitor/v2/visitor_learning/index.js -- module/find-all-modules fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("visitor/v2/visitor_learning/index.js -- module/find-all-modules fail ..." +
                    "response.statuCode = " + response.statusCode + "..." +
                    "response.body = " + response.body);
            }
            res.render('error/unknowerror');
        }
    });
});

module.exports = router;
