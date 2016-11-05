const express = require('express');
const bodyParser = require('body-parser');

var controller = require('./routes/time_series.js');
var github = require('./sources/github.js');
var model = require('./influx/query.js');
var analytics =require('./analytics/analysis.js');
var result;

var app = express();
app.use(bodyParser.json());
app.get('/hardcoded-data', controller.retrieveData);
app.get('/data/:datasource/:measurement', controller.retrieveData);
app.get('/data', controller.datasources);

app.post('/data/analytics', analytics.analysis);

app.listen(8080);
console.log('Listening on port 8080...');
