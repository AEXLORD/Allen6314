var express = require('express');
var router = express.Router();
var Logger = require('../../config/logconfig.js');
var logger = new Logger().getLogger();

router.get('',function(req,res,next){
    logger.debug("visitor/aboutme.js -- /visitor/aboutme ...");
    res.render('visitor/v2/aboutme');
});

module.exports = router;
