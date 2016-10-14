const express = require('express');
const bodyParser = require('body-parser');

var controller = require('./controllers/main_controller.js');
var github = require('./github.js');
var model = require('./query.js');
var result;
var app = express();
app.use(bodyParser.json());
app.get('/',controller.retrieveData);

app.get('/git',function(req,res){
  github.queryGitHub('BenEmdon', 'PocketMoney', function(list) {
      model.insertDB("commit", list);
  });

  res.send('Hello World');
});

app.get('/data/:datasource/:type',controller.getData);
app.get('/sample_data',controller.sampleData);
app.listen(8080);
