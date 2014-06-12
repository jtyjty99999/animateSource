var express = require('express')
  , app = express()
  , url = require('url')
  , path = require('path');
  
  var morgan  = require('morgan');
  app.use(morgan());
  
  app.set('port', process.env.PORT || 3000);//
  app.use(express.static(path.join(__dirname, 'public')));//静态文件支持

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');//利用express做跳转
});
app.get('/query',function(req, res){
  var queryObj = url.parse(req.url,true)
  console.log(queryObj.search)
  res.send({"message": "test"});  
});  
app.listen(5000);

