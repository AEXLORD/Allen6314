var cron = require('cron');
var request = require('request');
var fs = require('fs');
var ServerConstant = require('../../commons/constant/ServerConstant.js');
var serverConstant = new ServerConstant();

var ArticleCreator = function(){
	this.start = function(){
        var cronJob = cron.job("*/10 * * * * *", function(){
            var allArticleIDs[] = findAllArticleID();
            var path = serverConstant.getNginxHtmlPath();

            console.info('cron job completed');

            var url = "http://localhost:7000/visitor/article/faffca2d-329c-4ae8-b2ec-076ba266d7e3";
            var options = {
    	        url:url
            }

            request(options,function(error,response,body){
                var path = '/Users/wuhuachuan/github/myPro/Allen6314/frontallenway/fallenway/nginxpage/faffca2d-329c-4ae8-b2ec-076ba266d7e3.html';
                fs.writeFile(path,body,function(){
                    console.log("write ok");
                })
            });
        });
        cronJob.start();
	}
}

module.exports = ArticleCreator;
