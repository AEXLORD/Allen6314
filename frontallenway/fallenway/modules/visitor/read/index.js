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

    async.parallel({
        //请求tags
        tags:function(callback){
            var url = serverConstant.getBackendUrlPrefix() + "/module/" + moduleName + "/tag";

            request(url,function(error,response,body){

                if(error != null){
                    callback(error,data);
                }

                var returnData = JSON.parse(body);

                if(returnData.statusCode != 0){
                    logger.error("url = " + url + " --- returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                    return ;
                }

                callback(null,returnData.data)
            });

            //请求文章数据
        },
        page:function(callback){
            var url = serverConstant.getBackendUrlPrefix() + "/module/" + moduleName + "/article?page=1&size=100";

            request(url,function(error,response,body){
                if(error != null){
                    callback(error,null);
                }

                var returnData = JSON.parse(body);

                if(returnData.statusCode != 0){
                    logger.error("url = " + url + " --- returnData.statusCode = " + returnData.statusCode);
                    res.render('error/unknowerror');
                    return ;
                }

                callback(null,returnData.data);
            });
        }
    },function(err,results){
        if(!err){
            res.render('visitor/read/index',{'data':results});
        } else {
            logger.error(err.stack);
            res.render('error/unknowerror');
        }
    })
})

module.exports = router;
