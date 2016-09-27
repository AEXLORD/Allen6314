
//********************************************************
//*                     basic import                     *
//********************************************************
var express = require('express');
var app = express();

app.set('views','public/html');
app.use(express.static('public'));

var engines = require('consolidate');
app.engine('html',engines.swig);
app.set('view engine','html');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var request = require('request');

var Logger = require('./infrustructure/log/logconfig.js');
var logger = new Logger().getLogger();

var MyCookies = require('./utils/mycookies.js');
var mycookies = new MyCookies();

var ServerConstant = require('./commons/constant/ServerConstant.js');
var serverConstant = new ServerConstant();

var ExceptionCode = require('./commons/exception/ExceptionCode');
var exceptionCode = new ExceptionCode();



//********************************************************
//*                      access log                      *
//********************************************************
var myLogger = function (req, res, next) {
    logger.debug('request comes to node. path = ' + req.path + '... now = ' + new Date().toLocaleString());
    next();
};
app.use(myLogger);


//********************************************************
//*                     visitor route                    *
//********************************************************

//读书笔记
var visitor_read_index = require('./modules/visitor/read/index.js');
app.use('/visitor/read/index',visitor_read_index);
var visitor_read_article = require('./modules/visitor/read/article.js');
app.use('/visitor/read/article',visitor_read_article);

//留言板
var visitor_message = require('./modules/visitor/message/message.js');
app.use('/visitor/message',visitor_message);


//博主
var visitor_aboutme = require('./modules/visitor/me/aboutme.js');
app.use('/visitor/aboutme',visitor_aboutme);


//********************************************************
//*                admin oauth validation                *
//********************************************************
var myLogger_admin_oauth = function (req, res, next) {
    if(mycookies.getAdminAuthorizationCookie(req) == 'undefined'){
         logger.error("cookies == undefined......");
        res.render('admin/login');
    } else {
        next();
    }
};
app.use(myLogger_admin_oauth);


//********************************************************
//*                    admin route                       *
//********************************************************

//后台文章管理首页
var admin_article = require('./modules/admin/article.js');
app.use('/admin/article',admin_article);

//后台tag管理首页
var admin_tag = require('./modules/admin/tag.js');
app.use('/admin/tag',admin_tag);

//登录
var admin_login = require('./modules/admin/login.js');
app.use('/login',admin_login);

//********************************************************
//*                 exception handler                    *
//********************************************************

/*app.use(logErrors);*/
//app.use(requestErrorHandler);

//function logErrors(err,req,res,next){
    //logger.error("this is error@");
    //logger.error(err.stack);
    //next(err);
//}
//function requestErrorHandler(err,req,res,next){
    //res.status(500);
        //res.render('unknowerror', {
                //error: err
        //});
/*}*/



//********************************************************
//*             start (default 7000 port)                *
//********************************************************
app.listen(serverConstant.getNodePort());
logger.info("****************************************************");
logger.info("* * Application started on http://localhost:" + serverConstant.getNodePort() + "/  *");
logger.info("****************************************************");
