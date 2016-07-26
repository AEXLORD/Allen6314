var express = require('express');
var router = express.Router();
var request = require('request');

var async = require('async');

var Config = require('../../../../config/globalconfig');
var config = new Config();

var Logger = require('../../../../config/logconfig');
var logger = new Logger().getLogger();

router.get('', function(req, res, next) {
    var moduleName = "distributed";
    var url = config.getBackendUrlPrefix() + "article/find-articles-by-moduleName?moduleName=" +
                    moduleName + "&page=1&size=" + config.getArticleListPageSize();
    request(url,function(error,response,body){

        if(error == null){
            var returnData = JSON.parse(body);
            if(returnData.statusCode == 0){
                var data = {};
                data.articles = returnData.data.articles;
                data.nowPageLeft = 0;
                data.nowPage = 1;
                data.nowPageRight = 2;
                data.moduleName = "distributed";

                data.totalPage = new Array();
                for(var i = 1; i <= returnData.data.totalPage;i++){
                    data.totalPage[i-1] = i;
                }
                res.render('visitor/v5/distributed/index',{'data':data});
            } else {
                logger.error("visitor/v5/distributed/index.js -- article/find-articles-by-moduleName?moduleName= fail ..." +
                               " returnData.statusCode = " + returnData.statusCode);
                res.render('error/unknowerror');
            }
        } else {
            logger.error(error);
            res.render('error/unknowerror');
        }
    });
})

module.exports = router;
