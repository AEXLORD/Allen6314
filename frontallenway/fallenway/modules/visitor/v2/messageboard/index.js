var express = require('express');
var router = express.Router();

var Logger = require('../../../../config/logconfig.js');
var logger = new Logger().getLogger();

router.get('',function(req,res,next){
    logger.debug("visitor/v2/messageboard/index.js -- /visitor/messageboard ...");
    res.render('visitor/v3/messageboard/index');
});

module.exports = router;
