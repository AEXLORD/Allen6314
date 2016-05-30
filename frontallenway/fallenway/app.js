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

//游客
var visitor_learning_index = require('./modules/visitor/v2/learning/index');
var visitor_learning_article = require('./modules/visitor/v2/learning/article');
var visitor_learning_tag = require('./modules/visitor/v2/learning/tag');
app.use('/visitor/learning/index',visitor_learning_index);
app.use('/visitor/learning/article',visitor_learning_article);
app.use('/visitor/learning/tag',visitor_learning_tag);

var visitor_aboutme = require('./modules/visitor/v2/me/aboutme');
app.use('/visitor/aboutme',visitor_aboutme);

var visitor_play = require('./modules/visitor/v2/play/play');
app.use('/visitor/play',visitor_play);


//管理员
var admin_index = require('./modules/admin/index.js');
var admin_article = require('./modules/admin/article.js');
var admin_operation = require('./modules/admin/operation.js');
var admin_bug = require('./modules/admin/bug.js');
var admin_login = require('./modules/admin/login.js');
var admin_tag = require('./modules/admin/tag.js');
var admin_author = require('./modules/admin/author.js');
var admin_module = require('./modules/admin/module.js');
app.use('/login',admin_login);
app.use('/admin/index',admin_index);
app.use('/admin/article',admin_article);
app.use('/admin/operation',admin_operation);
app.use('/admin/bug',admin_bug);
app.use('/admin/tag',admin_tag);
app.use('/admin/author',admin_author);
app.use('/admin/module',admin_module);

var port = 7000;
app.listen(port);
console.log("Application started on http://localhost:" + port + "/");
