var express = require('express');
var router = express.Router();

var Logger = require('../../../../config/logconfig.js');
var logger = new Logger().getLogger();

router.get('',function(req,res,next){
    logger.debug("visitor/v2/aboutme.js -- /visitor/aboutme ...");
    res.render('visitor/v3/me/aboutme');
});

module.exports = router;
