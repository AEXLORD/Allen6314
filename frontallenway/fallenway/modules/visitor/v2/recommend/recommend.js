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

    logger.debug("visitor/v2/recommend/recommend.js -- /visitor/recommend ...");

    res.redirect('/visitor/recommend/zhihu');
});



router.get('/zhihu',function(req,res,next){

    logger.debug("visitor/v2/recommend/recommend.js -- /visitor/zhihu ...");


    async.waterfall([
        function(callback){
            request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
                if(!error && response.statusCode == 200){
                    var returnData = JSON.parse(body);

                    if(returnData.statusCode != 0){
                        logger.error("visitor/v2/recommend/recommend.js -- module/find-all-modules fail ..." +
                            "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
                    } else {
                        callback(null,returnData.data);
                    }
                } else {
                    logger.error("visitor/v2/recommend/recommend.js -- module/find-all-modules fail ..." +
                            "error = " + error);
                    if(response != null){
                        logger.error("visitor/v2/recommend/recommend.js -- module/find-all-modules fail ..." +
                            "response.statuCode = " + response.statusCode + "..." +
                            "response.body = " + response.body);
                    }
                    res.render('error/unknowerror');
                }
            });
        },function(data,callback){
            var modules = data.modules;

            var moduleid;
            modules.forEach(function(entry){
                if(entry.name == "推荐"){
                    moduleid = entry.id;
                }
            })

            var results = {};
            async1.parallel({
                tags:function(subcallback){
                    request(config.getBackendUrlPrefix() + "tag/find-tags-by-moduleid?moduleid=" + moduleid,function(error,response,body){
                        if(!error && response.statusCode == 200){
                            var returnData = JSON.parse(body);
                            if(returnData.statusCode != 0){
                                logger.error("visitor/v2/recommend/recommend.js -- tag/find-tags-by-moduleid?moduleid= fail ..." +
                                   "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                                res.render('error/unknowerror');
                            } else {
                                subcallback(null,returnData.data.tags);
                            }
                        } else {
                            logger.error("visitor/v2/recommend/recommend.js -- tag/find-tags-by-moduleid?moduleid= fail ..." +
                                "error = " + error);
                            if(response != null){
                                logger.error("visitor/v2/recommend/recommend.js -- tag/find-tags-by-moduleid?moduleid= fail ..." +
                                   "response.statuCode = " + response.statusCode + "..." +
                                   "response.body = " + response.body);
                            }
                            res.render('error/unknowerror');
                        }
                    });
                },
                recommends:function(subcallback){
                    var url = config.getBackendUrlPrefix() + "recommend/find-recommends-by-classify?classify=zhihu";

                    console.log("url = " + url);

                    request(url,function(error,response,body){
                        if(!error && response.statusCode == 200){
                            var returnData = JSON.parse(body);

                            if(returnData.statusCode != 0){
                                logger.error("visitor/v2/recommend/recommed.js -- recommend/find-recommends-by-classify?classify=zhihu fail ..." +
                                   "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                                res.render('error/unknowerror');
                            } else {
                                subcallback(null,returnData.data.recommends);
                            }
                        } else {
                            logger.error("visitor/v2/recommend/recommend.js -- recommend/find-recommends-by-classify?classify=zhihu fail ..." +
                                "error = " + error);
                            if(response != null){
                                logger.error("visitor/v2/recommend/recommend.js -- recommend/find-recommends-by-classify?classify=zhihu fail ..." +
                                   "response.statuCode = " + response.statusCode + "..." +
                                   "response.body = " + response.body);
                            }
                            res.render('error/unknowerror');
                        }
                    });
                }
            },function(err,results){
                data.tags = results.tags;
                data.recommends = results.recommends;
                callback(null,data);
            })
        }],function(err,result){
            res.render('visitor/v3/recommend/zhihu',{'data':result});
        })
});


/*router.get('/stroll',function(req,res,next){*/

    //logger.debug("visitor/v2/play/play.js -- /visitor/stroll ...");

    //request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
        //if(!error && response.statusCode == 200){
            //var returnData = JSON.parse(body);

            //if(returnData.statusCode != 0){
                //logger.error("visitor/v2/recommend/index.js -- module/find-all-modules fail ..." +
                    //"response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                //res.render('error/unknowerror');
            //} else {
                //res.render('visitor/v3/play/stroll',{"data":returnData.data});
            //}
        //} else {
            //logger.error("visitor/v2/recommend/index.js -- module/find-all-modules fail ..." +
                //"error = " + error);
            //if(response != null){
                //logger.error("visitor/v2/recommend/index.js -- module/find-all-modules fail ..." +
                    //"response.statuCode = " + response.statusCode + "..." +
                    //"response.body = " + response.body);
            //}
            //res.render('error/unknowerror');
        //}
    //});

//})


//router.get('/eat',function(req,res,next){

    //logger.debug("visitor/v2/play/play.js -- /visitor/eat ...");

    //request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
        //if(!error && response.statusCode == 200){
            //var returnData = JSON.parse(body);

            //if(returnData.statusCode != 0){
                //logger.error("visitor/v2/recommend/index.js -- module/find-all-modules fail ..." +
                    //"response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                //res.render('error/unknowerror');
            //} else {
                //res.render('visitor/v3/play/eat',{"data":returnData.data});
            //}
        //} else {
            //logger.error("visitor/v2/recommend/index.js -- module/find-all-modules fail ..." +
                //"error = " + error);
            //if(response != null){
                //logger.error("visitor/v2/recommend/index.js -- module/find-all-modules fail ..." +
                    //"response.statuCode = " + response.statusCode + "..." +
                    //"response.body = " + response.body);
            //}
            //res.render('error/unknowerror');
        //}
    //});

//})
module.exports = router;
