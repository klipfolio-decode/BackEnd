const express = require('express');
const bodyParser = require('body-parser');

var controller = require('./controllers/main_controller.js');

var app = express();
app.use(bodyParser.json());

app.get('/',function(req,res){
    res.send('Hello World');
});

app.get('/data/:datasource/:type',controller.getData);
app.listen(8080);
