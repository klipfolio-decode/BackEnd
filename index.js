const express = require('express');
const bodyParser = require('body-parser');

var controller = require('./controllers/main_controller.js');
var github = require('./github.js');
var model = require('./query.js');
var result;
var app = express();
app.use(bodyParser.json());
app.get('/hardcoded-data', controller.retrieveData);

app.get('/data/:datasource/:measurement',controller.retrieveData);
app.get('/sample_data',controller.sampleData);
app.listen(8080);
