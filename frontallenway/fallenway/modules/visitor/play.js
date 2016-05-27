var express = require('express');
var router = express.Router();
var Logger = require('../../config/logconfig.js');
var logger = new Logger().getLogger();

router.get('',function(req,res,next){
    logger.debug("visitor/play.js -- /visitor/play ...");
    res.render('visitor/v2/play');
});

module.exports = router;
