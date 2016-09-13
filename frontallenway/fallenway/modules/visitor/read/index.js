var express = require('express');
var router = express.Router();
var request = require('request');

var async = require('async');

var ServerConstant = require('../../../commons/constant/ServerConstant.js');
var serverConstant = new ServerConstant();

var Logger = require('../../../infrustructure/log/logconfig.js');
var logger = new Logger().getLogger();

var moduleName = "read";

router.get('', function(req, res, next) {

    async.waterfall([
        //请求tags
        function(callback){
            var url = serverConstant.getBackendUrlPrefix() + "/module/" + moduleName + "/tag";

            request(url,function(error,response,body){

                if(error != null){
                    callback(error,data);
                }

                var returnData = JSON.parse(body);

                if(returnData.statusCode != 0){
                    logger.error("url = " + url + " --- returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                }

                var data = {};
                data.tags = returnData.data;
                callback(null,data)
            });

            //请求文章数据
        },function(data,callback){

            var tag = data.tags[0];

            if(tag != null){
                var url = serverConstant.getBackendUrlPrefix() + "/tag/" + tag.id + "/article";

                request(url,function(error,response,body){

                    if(error != null){
                        callback(error,data)
                    }

                    var returnData = JSON.parse(body);

                    if(returnData.statusCode != 0){
                        logger.error("url = " + url + " --- returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
                    }

                    data.articles = returnData.data;
                    callback(null,data)
                });
            } else {
                callback(null,data);
            }
        }],
    function(err,result){
        console.log(result);
        if(!err){
            res.render('visitor/read/index',{'data':result});
        } else {
            logger.error(err.stack);
            res.render('error/unknowerror');
        }
    })
})

module.exports = router;
