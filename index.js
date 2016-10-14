const express = require('express');
const influx = require('influx');

var app = express();

app.get('/',function(req,res){
    res.send('Hello World');
});

app.listen(8080);