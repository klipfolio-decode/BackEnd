const express = require('express');
const bodyParser = require('body-parser');

var time_series = require('./routes/time_series.js');
var github = require('./sources/github.js');
var model = require('./influx/query.js');
var analytics = require('./analytics/analysis.js');
var result;

var app = express();
app.use(bodyParser.urlencoded({'extended' : 'true'}));
app.use(bodyParser.json());

app.get('/data/:datasource/:measurement',time_series.retrieveData);

app.get('/data', time_series.datasources);
app.post('/data/', time_series.postData);

app.post('/data/analytics', analytics.analysis);

app.listen(8080);
console.log("Listening on port 8080...");
