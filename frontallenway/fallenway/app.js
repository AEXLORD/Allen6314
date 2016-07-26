
//********************************************************
//*                     basic import                     *
//********************************************************
var express = require('express');
var app = express();

app.set('views','views');
app.use(express.static('public'));

var engines = require('consolidate');
app.engine('html',engines.swig);
app.set('view engine','html');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var request = require('request');

var Logger = require('./config/logconfig.js');
var logger = new Logger().getLogger();

var MyCookies = require('./common_utils/mycookies.js');
var mycookies = new MyCookies();

var Config = require('./config/globalconfig.js');
var config = new Config();

var ExceptionCode = require('./infrustructure_services/ExceptionCode');
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
var visitor_learning_index = require('./modules/visitor/v5/learning/index');
var visitor_learning_article = require('./modules/visitor/v5/learning/article');
var visitor_learning_tag = require('./modules/visitor/v5/learning/tag');
var visitor_aboutme = require('./modules/visitor/v5/me/aboutme');
var visitor_distributed_index = require('./modules/visitor/v5/distributed/index.js');
var visitor_thread_index = require('./modules/visitor/v5/thread/index.js');
//var visitor_user = require('./modules/visitor/v5/user/user.js');
app.use('/visitor/learning/index',visitor_learning_index);
app.use('/visitor/learning/article',visitor_learning_article);
app.use('/visitor/learning/tag',visitor_learning_tag);
app.use('/visitor/aboutme',visitor_aboutme);
app.use('/visitor/thread/index',visitor_thread_index);
app.use('/visitor/distributed/index',visitor_distributed_index);
//app.use('/visitor/user',visitor_user);



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
var admin_index = require('./modules/admin/v5//index.js');
var admin_article = require('./modules/admin/v5/article.js');
var admin_login = require('./modules/admin/v5/login.js');
var admin_tag = require('./modules/admin/v5/tag.js');
//var admin_author = require('./modules/admin/v5/author.js');
//var admin_module = require('./modules/admin/v5/module.js');
app.use('/login',admin_login);
app.use('/admin/index',admin_index);
app.use('/admin/article',admin_article);
app.use('/admin/tag',admin_tag);
//app.use('/admin/author',admin_author);
//app.use('/admin/module',admin_module);

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
app.listen(config.getNodePort());
logger.info("****************************************************");
logger.info("* * Application started on http://localhost:" + config.getNodePort() + "/  *");
logger.info("****************************************************");
