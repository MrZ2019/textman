
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var fs = require('fs');
global.fs = fs;
var path = require('path');
var https = require('https');
var privateKey  = fs.readFileSync('./crt/private.pem', 'utf8');
var certificate = fs.readFileSync('./crt/file.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var colors = require('colors');
global._ = require('underscore');
global.util = require('./utils/util');

var app = express();

// all environments
app.set('port', process.env.PORT || 7002);
app.set('sslport', process.env.PORT || 17002);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({ limit:'50mb',keepExtensions: true, uploadDir: "./public/upload"})); 
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
// app.use(express.bodyParser.json({limit:'50mb'}));
// app.use(express.bodyParser.urlencoded({limit:'50mb',extended:true})); 
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
console.log(__dirname);
app.use(express.favicon(__dirname + '/favicon.ico'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
var demo = require('./routes/demo')


// Mynote
var mynote = require("./routes/mynote");


app.get('/', mynote.index);

app.all('/api/adddata', mynote.addData);
app.all('/api/delrow', mynote.deleteRow);
app.all('/api/editrow', mynote.editRow);
app.get('/api/getdata', mynote.getData);
app.all('/api/getappdata', mynote.getAppData);

// zhihu
app.get('/zhihu', mynote.zhihu.index);
app.get('/api/zhihu/initial', mynote.zhihu.initial);
app.get('/api/zhihu/counter', mynote.zhihu.counter);
app.get('/zhihu/topic/:id', mynote.zhihu.topic);
app.get('/zhihu/question/:id', mynote.zhihu.question);
app.get('/zhihu/question/:id', mynote.zhihu.question);
app.get('/zhihu/answer/:id', mynote.zhihu.answer);

app.get('/api/zhihu/query', mynote.zhihu.query);
app.get('/api/zhihu/addtopic', mynote.zhihu.addTopic);
app.get('/api/zhihu/settopic', mynote.zhihu.setTopic);
app.get('/api/zhihu/addquestion', mynote.zhihu.addQuestion);
app.get('/api/zhihu/question/adddesc', mynote.zhihu.addDescForQuestion);
app.post('/api/zhihu/question/addtopic', mynote.zhihu.addTopicForQuestion);
app.get('/api/zhihu/adduser', mynote.zhihu.addUser);
app.post('/api/zhihu/addanswer', mynote.zhihu.addAnswer);
app.post('/api/zhihu/addcomment', mynote.zhihu.addComment);

// douban

app.get('/douban', mynote.douban.index);
app.get('/api/douban/initial', mynote.douban.initial);
app.get('/api/douban/counter', mynote.douban.counter);
app.get('/douban/topic/:id', mynote.douban.topic);
app.get('/douban/note/:id', mynote.douban.note);

app.get('/api/douban/addtopic', mynote.douban.addTopic);
app.post('/api/douban/addnote', mynote.douban.addNote);
app.post('/api/douban/adduser', mynote.douban.addUser);
app.post('/api/douban/addshuo', mynote.douban.addShuo);
app.post('/api/douban/addcomment', mynote.douban.addComment);


app.all('/api/syncvoid', mynote.syncVoid);

app.get('/users', user.list);

// My Gallery
var gallery = require('./routes/gallery');
app.get('/gallery', gallery.index);
app.get('/gallery/:title', gallery.detail);

// var mysong = require("./routes/mysong");
// app.all('/mysong', mysong.index);
// app.all('/api/addsong', mysong.addsong);
// app.all('/api/delsong', mysong.delsong);
// app.all('/api/editsong', mysong.editsong);

app.all('/demo', demo.index);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));

  setTimeout(function() {
  	  console.log('服务启动成功'.green);
  }, 2000) 
});


https.createServer(credentials, app).listen(app.get('sslport'), function() {
    console.log('HTTPS Server is running on: https://localhost:%s', app.get('sslport'));
});