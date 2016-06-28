var express = require('express');
var router = express.Router();

var request = require('request');
var async = require('async');
var async1 = require('async');

var Logger = require('../../../../config/logconfig.js');
var logger = new Logger().getLogger();

var Config = require('../../../../config/globalconfig.js');
var config = new Config();

router.get('',function(req,res,next){
    res.redirect('/visitor/scrum/index');
});




router.get('/index',function(req,res,next){
    async.parallel({
        modules:function(callback){
            request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
                if(!error && response.statusCode == 200){
                    var returnData = JSON.parse(body);

                    if(returnData.statusCode != 0){
                        logger.error("visitor/v2/messageboard/index.js -- module/find-all-modules fail ..." +
                            "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
                    } else {
                        callback(null,returnData.data.modules);
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
        }/*,*/
        //scrums:function(callback){
            //var url = config.getBackendUrlPrefix() + "scrum/find-scrums-by-classify?classify=movie";

            //request(url,function(error,response,body){
                //if(!error && response.statusCode == 200){
                    //var returnData = JSON.parse(body);

                    //if(returnData.statusCode != 0){
                        //logger.error("visitor/v2/scrum/recommed.js -- scrum/find-scrums-by-classify?classify=movie fail ..." +
                            //"response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                            //res.render('error/unknowerror');
                    //} else {
                        //var data = {};
                        //var scrums = returnData.data.scrums;
                        /*data.scrums_hanguo = new Array();*/

                       /* var m = 0;*/
                        //for(var i = 0; i < scrums.length; ++i){
                            //var other = scrums[i].other;
                            //if(other == '韩国'){
                                //data.scrums_hanguo[m] = scrums[i];
                                //m = m + 1;
                            //}
                        //}
                        //callback(null,data);
                    //}
                //} else {
                    //logger.error("visitor/v2/scrum/scrum.js -- scrum/find-scrums-by-classify?classify=movie fail ..." +
                        //"error = " + error);
                    //if(response != null){
                        //logger.error("visitor/v2/scrum/scrum.js -- scrum/find-scrums-by-classify?classify=movie fail ..." +
                            //"response.statuCode = " + response.statusCode + "..." +
                            //"response.body = " + response.body);
                    //}
                    //res.render('error/unknowerror');
                //}
            //});
        /*}*/
    },function(err,result){
        res.render('visitor/v3/scrum/scrumIndex',{'data':result});
    })
})



module.exports = router;
