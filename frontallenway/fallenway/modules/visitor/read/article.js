var express = require('express');
var router = express.Router();
var request = require('request');

var async = require('async');
var md = require('node-markdown').Markdown;

var ServerConstant = require('../../../commons/constant/ServerConstant.js');
var serverConstant = new ServerConstant();

var Logger = require('../../../infrustructure/log/logconfig.js');
var logger = new Logger().getLogger();

router.get('/:id',function(req,res,next){
    var url = serverConstant.getBackendUrlPrefix() + "/article/" + req.params.id;
    request(url,function(error,response,body){
        if(error != null){
            logger.error(error);
            res.render('error/unknowerror');
        }

        var returnData = JSON.parse(body);

        logger.info(returnData)

        if(returnData.statusCode != 0){
            logger.error("url = " + url + " -- returnData.statusCode = " + returnData.statusCode);
            res.render('error/unknowerror');
        }
        returnData.data.content = md(returnData.data.content);
        res.render('visitor/read/articleDetail',{'data':returnData.data});
    });
});


/*router.post('/vote',function(req,res,next){*/
    //logger.info("type = " + req.body.type);
    //logger.info("articleId = " + req.body.articleId);

    //var url = config.getBackendUrlPrefix() + "article/vote";
	//var data = {
            //'id': req.body.articleId,
            //'type': req.body.type,
        //}
    //var options = {
        //url:url,
		//form:data
    //}
    //request.post(options,function(error,response,body){
        //if(!error && response.statusCode == 200 ){
            //var returnData = JSON.parse(body);
            //if(returnData.statusCode == 0){
                //res.end();
            //} else {
				//logger.log("visitor/learning/article.js -- /vote -- response.statusCode = 200, returnData.statusCode != 0 ");
                //res.status(500).end();
            //}
        //} else {
            //logger.error("visitor/learning/article.js -- /vote --  ..." + "error = " + error);
            //res.status(500).end();
		//}
       //});
/*});*/


module.exports = router;
