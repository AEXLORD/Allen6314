var express = require('express');
var router = express.Router();

var request = require('request');
var async = require('async');
var async1 = require('async');

var Logger = require('../../../../config/logconfig');
var logger = new Logger().getLogger();

var Config = require('../../../../config/globalconfig');
var config = new Config();



var getModule = function(callback){
    request(config.getBackendUrlPrefix() + "module/find-all-modules",function(error,response,body){
        if(!error && response.statusCode == 200){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
                callback(null,returnData.data.modules);
            } else {
                logger.error("visitor/v2/visitor_learning/index.js -- module/find-all-modules fail ..." +
                    " returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            }
        } else {
            res.render('error/unknowerror');
        }
    });
}




router.get('',function(req,res,next){
    res.redirect('/visitor/recommend/to-zhihu');
});


router.get('/to-movies',function(req,res,next){
    async.parallel({
        modules:function(callback){
            getModule(callback);
        },
        recommends:function(callback){
            request(config.getBackendUrlPrefix() + "recommend/find-recommends-by-classify?classify=movie",function(error,response,body){
                var returnData = JSON.parse(body);
                if(returnData.statusCode == 0){
                    var data = {};
                    var recommends = returnData.data.recommends;
                    data.recommends_hanguo = new Array();
                    var m = 0;
                    for(var i = 0; i < recommends.length; ++i){
                        var other = recommends[i].other;
                        if(other == '韩国'){
                            data.recommends_hanguo[m] = recommends[i];
                            m = m + 1;
                        }
                    }
                    callback(null,data);
                } else {
                    logger.error("visitor/v2/recommend/recommed.js -- recommend/find-recommends-by-classify?classify=movie fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                }
            });
        }
    },function(err,result){
        if(err == null){
            result.recommends_hanguo = result.recommends.recommends_hanguo;
            res.render('visitor/v3/recommend/movie',{'data':result});
        } else {
            logger.error(err.stack);
            res.render('error/unknowerror');
        }
    })
})




router.get('/to-zhihu',function(req,res,next){
    async.parallel({
        modules:function(callback){
            getModule(callback);
        },
        recommends:function(callback){
            request(config.getBackendUrlPrefix() + "recommend/find-recommends-by-classify?classify=zhihu",function(error,response,body){
                var returnData = JSON.parse(body);
                if(returnData.statusCode == 0){
                    var data = {};
                    var recommends = returnData.data.recommends;
                    data.recommends_zhangzishi = new Array();
                    data.recommends_lizhi = new Array();
                    data.recommends_interest = new Array();
                    var m = 0,n=0,k=0;
                    for(var i = 0; i < recommends.length; ++i){
                        var other = recommends[i].other;
                        if(other == '励志'){
                            data.recommends_lizhi[m] = recommends[i];
                            m = m + 1;
                        } else if(other == '涨姿势'){
                            data.recommends_zhangzishi[n] = recommends[i];
                            n = n + 1;
                        } else {
                            data.recommends_interest[k] = recommends[i];
                            k = k + 1;
                        }
                    }
                    callback(null,data);
                } else {
                    logger.error("visitor/v2/recommend/recommed.js -- recommend/find-recommends-by-classify?classify=zhihu fail ..." +
                        " returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                }
            });
        }
    },function(err,result){
        if(err == null){
            result.recommends_zhangzishi = result.recommends.recommends_zhangzishi;
            result.recommends_lizhi = result.recommends.recommends_lizhi;
            result.recommends_interest = result.recommends.recommends_interest;
            res.render('visitor/v3/recommend/zhihu',{'data':result});
        } else {
            logger.error(err.stack);
            res.render('error/unknowerror');
        }
    })
})


module.exports = router;
