var express = require('express');
var router = express.Router();

var Logger = require('../../../../config/logconfig.js');
var logger = new Logger().getLogger();

var request = require('request');

var Config = require('../../../../config/globalconfig.js');
var config = new Config();


router.get('/logout',function(req,res,next){
    logger.info("id = " + req.query.id);
    request(config.getBackendUrlPrefix() + "user/logout?id="+req.query.id,function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);

            if(returnData.statusCode != 0){
                logger.error("visitor/v2/messageboard/index.js -- module/find-all-modules fail ..." +
                    "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            } else {
                res.redirect("/visitor/scrum");
            }
        } else {
            logger.error("visitor/v2/messageboard/index.js -- module/find-all-modules fail ..." +
                "error = " + error);
            if(response != null){
                logger.error("visitor/v2/messageboard/index.js -- module/find-all-modules fail ..." +
                    "response.statuCode = " + response.statusCode + "..." +
                    "response.body = " + response.body);
            }
            res.render('error/unknowerror');
        }
    });
})


module.exports = router;
