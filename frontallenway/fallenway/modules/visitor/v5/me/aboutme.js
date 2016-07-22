var express = require('express');
var router = express.Router();

router.get('',function(req,res,next){
    res.render('visitor/v5/me/aboutme');
});

module.exports = router;
