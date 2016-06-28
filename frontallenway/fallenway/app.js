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

var Logger = require('./config/logconfig.js');
var logger = new Logger().getLogger();

var myLogger = function (req, res, next) {
    logger.debug('request comes to node. path = ' + req.path + '... now = ' + new Date().toLocaleString());
    next();
};
app.use(myLogger);

//游客
var visitor_learning_index = require('./modules/visitor/v2/learning/index');
var visitor_learning_article = require('./modules/visitor/v2/learning/article');
var visitor_learning_tag = require('./modules/visitor/v2/learning/tag');
app.use('/visitor/learning/index',visitor_learning_index);
app.use('/visitor/learning/article',visitor_learning_article);
app.use('/visitor/learning/tag',visitor_learning_tag);

var visitor_aboutme = require('./modules/visitor/v2/me/aboutme');
app.use('/visitor/aboutme',visitor_aboutme);

var visitor_recommend = require('./modules/visitor/v2/recommend/recommend');
app.use('/visitor/recommend',visitor_recommend);

var visitor_message = require('./modules/visitor/v2/messageboard/index.js');
app.use('/visitor/messageboard',visitor_message);

var visitor_scrum = require('./modules/visitor/v2/scrum/scrum.js');
app.use('/visitor/scrum',visitor_scrum);

var visitor_register = require('./modules/visitor/v2/user/register.js');
app.use('/visitor/user/register',visitor_register);

var visitor_login = require('./modules/visitor/v2/user/login.js');
app.use('/visitor/user/login',visitor_login);

//管理员
var admin_index = require('./modules/admin/index.js');
var admin_article = require('./modules/admin/article.js');
var admin_operation = require('./modules/admin/operation.js');
var admin_bug = require('./modules/admin/bug.js');
var admin_login = require('./modules/admin/login.js');
var admin_tag = require('./modules/admin/tag.js');
var admin_author = require('./modules/admin/author.js');
var admin_module = require('./modules/admin/module.js');
var admin_message = require('./modules/admin/message.js');
var admin_recommend = require('./modules/admin/recommend.js');
app.use('/login',admin_login);
app.use('/admin/index',admin_index);
app.use('/admin/article',admin_article);
app.use('/admin/operation',admin_operation);
app.use('/admin/bug',admin_bug);
app.use('/admin/tag',admin_tag);
app.use('/admin/author',admin_author);
app.use('/admin/module',admin_module);
app.use('/admin/message',admin_message);
app.use('/admin/recommend',admin_recommend);

var port = 7000;
app.listen(port);
console.log("Application started on http://localhost:" + port + "/");
