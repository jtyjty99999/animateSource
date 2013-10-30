var express = require('express')
  , app = express()
  , url = require('url')
  , path = require('path');
  app.configure(function(){
  app.set('port', process.env.PORT || 3000);//
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());//解析客户端请求
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));//静态文件支持
});
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');//利用express做跳转
});
app.get('/query',function(req, res){
  var queryObj = url.parse(req.url,true)
  console.log(queryObj.search)
  res.send({"message": "test"});  
});  
app.listen(5000);

