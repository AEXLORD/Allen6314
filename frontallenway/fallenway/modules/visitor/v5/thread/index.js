var express = require('express');
var router = express.Router();
var request = require('request');

var async = require('async');

var Config = require('../../../../config/globalconfig');
var config = new Config();

var Logger = require('../../../../config/logconfig');
var logger = new Logger().getLogger();

router.get('', function(req, res, next) {
    res.render('visitor/v5/thread/index');
    /*async.parallel({*/
        //tags:function(callback){
            //var moduleName = "learning";
            //var url = config.getBackendUrlPrefix() + "tag/find-tags-by-moduleName?moduleName="+moduleName;
            //request(url,function(error,response,body){
                //var returnData = JSON.parse(body);
                //if(returnData.statusCode == 0){
                    //callback(null,returnData.data.tags);
                //} else {
                    //logger.error("visitor/v5/learning/index.js -- tag/find-tags-by-moduleName?moduleName= fail ..." +
                               //" returnData.statusCode = " + returnData.statusCode);
                    //res.render('error/unknowerror');
                //}
            //});
        //},
        //articles_totalPage:function(callback){
            //var moduleName = "learning";
            //var url = config.getBackendUrlPrefix() + "article/find-articles-by-moduleName?moduleName=" +
                            //moduleName + "&page=1&size=" + config.getArticleListPageSize();
            //request(url,function(error,response,body){
                //var returnData = JSON.parse(body);
                //if(returnData.statusCode == 0){
                    //callback(null,returnData.data);
                //} else {
                    //logger.error("visitor/v5/learning/index.js -- article/find-articles-by-moduleName?moduleName= fail ..." +
                           //" returnData.statusCode = " + returnData.statusCode);
                    //res.render('error/unknowerror');
                //}
            //});
        //}
    //},function(err,results){
        //if(err == null){
            //var data = {};
            //data.tags = results.tags;
            //data.articles = results.articles_totalPage.articles;
            //data.nowPageLeft = 0;
            //data.nowPage = 1;
            //data.nowPageRight = 2;
            //data.moduleName = "learning";

            //data.totalPage = new Array();
            //for(var i = 1; i <= results.articles_totalPage.totalPage;i++){
                //data.totalPage[i-1] = i;
            //}
            //res.render('visitor/v5/learning/index',{'data':data});
        //} else {
            //logger.error(err);
            //res.render('error/unknowerror');
        //}
    /*})*/
})

module.exports = router;
