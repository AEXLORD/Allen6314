var express = require('express');
var router = express.Router();
var request = require('request');

var Config = require('../../config/globalconfig.js');
var config = new Config();

var MyCookies = require('../../config/mycookies.js');
var mycookies = new MyCookies();

var Logger = require('../../config/logconfig.js');
var logger = new Logger().getLogger();

router.get('',function(req,res,next){

    logger.debug("admin/operation.js -- /admin/operation ...");

    var cookies = mycookies.getMyCookies(req);
	if(cookies['Authorization'] == 'undefined'){
 		logger.info("cookies[Authorization] == undefined......");
		res.render('admin/login');
	} else {
        	doSendRequestGetRecords(res,cookies);
    }
});

function doSendRequestGetRecords(res,cookies){

	var url = config.getBackendUrlPrefix() + "auth/operation/get-records";
	var options = {
        url:url,
        headers:{
            'Authorization': "Bearer " + cookies['Authorization']
        }
    }

    	request(options,function(error,response,body){
        	if(!error && response.statusCode == 200){
            		var returnData = JSON.parse(body);

            		if(returnData.statusCode != 0){
                        logger.error("admin/operation.js -- auth/operation/get-records fail ..." +
                            "response.statusCode = 200, but returnData.statusCode = " + returnData.statusCode);
                        res.render('error/unknowerror');
            		} else {
                		var path = "<li><a href = \"/admin/index\">Index</a></li>" +
                            		"<li>Operation Manage</li>";

                		var data = {
                    		'records':returnData.data.records,
                    		'path':path
                		}
               	 		res.render('admin/operation/operIndex',{'data':data});
            		}
        	} else {
                logger.error("admin/operation.js -- auth/operation/get-records fail ..." +
                    "error = " + error);
                if(response != null){
                    logger.error("admin/operation.js -- auth/operation/get-records fail ..." +
                        "response.statuCode = " + response.statusCode + "..." +
                        "response.body = " + response.body);
                    }
            	if(response.statusCode == 401){
                    res.render('admin/login');
            	} else {
                    res.render('error/unknowerror');
            	}
        	}
    	});
}

module.exports = router;


