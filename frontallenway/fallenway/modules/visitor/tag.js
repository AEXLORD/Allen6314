var express = require('express');
var request = require('request');
var async = require('async');
var Config = require('../../config/globalconfig.js');

var config = new Config();
var router = express.Router();

var Logger = require('../../config/logconfig.js');
var logger = new Logger().getLogger();

router.post('/add-tag',function(req,res,next){

    logger.debug("visitor/tag.js -- /visitor/tag/add-tag ...");

    logger.info("name = " + req.body.name);

});

module.exports = router;
