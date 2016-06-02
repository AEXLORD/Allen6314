var express = require('express');
var router = express.Router();

var Logger = require('../../../../config/logconfig.js');
var logger = new Logger().getLogger();

router.get('',function(req,res,next){
    logger.debug("visitor/v2/play/play.js -- /visitor/play ...");
    res.render('visitor/v3/play/play');
});

module.exports = router;
