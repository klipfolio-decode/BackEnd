/**
* This module is the endpoint definition for the time series data
*/

'use strict'

var schema = require('../sources/schema.js');
var validation = require('../sources/validation.js');

var GithubInfluxAdapter = require('../sources/GithubInfluxAdapter.js').GithubInfluxAdapter;

module.exports.retrieveData = function (req,res){
  var datasource = req.params.datasource;
  var measurement = req.params.measurement;

  var validateQuery = validation.validate(req);

  // Validate the data
  if (validateQuery){
    // teapot??
    res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
    res.status(418).json({'error' : validateQuery, 'data' : null });
  } else {

    var requiredFilters = {};
    var optionalFilters = {};

    var requiredFilter = schema.datasources[datasource].measurements[measurement].filter.required;
    var optionalFilter = schema.datasources[datasource].measurements[measurement].filter.optional;

    for(var i=0; i<requiredFilter.length; i++){
      requiredFilters[requiredFilter[i]] = req.query[requiredFilter[i]];
    }

    for(var i=0; i<optionalFilter.length; i++){
      optionalFilters[optionalFilter[i]] = req.query[optionalFilter[i]];
    }

    var params = {};
    params.datasource = datasource;
    params.measurement = measurement;
    params.start = req.query.start;
    params.end = req.query.end;
    params.interval = req.query.interval;
    params. requiredFilters = requiredFilters;
    params.optionalFilters = optionalFilters;

    var githubInfluxAdapter = new GithubInfluxAdapter(params);

    githubInfluxAdapter.queryGithubData().then( (data) => {
      githubInfluxAdapter.save(data).then(() => {
        githubInfluxAdapter.fetch(params).then( (points) => {
           res.status(200).json({ 'error' : null , 'data' : points})
        })
      })
    })


    // query.checkDataSourceExists(datasource).then(exists => {
    //   if (exists){
    //     query.storeData(params).then(() => {
    //       query.fetchData(params).then(points => {
    //          res.status(200).json(points);
    //       });
    //     });
    //   } else {
    //     query.createDatabase(datasource).then( () => {
    //       query.storeData(params).then(() => {
    //         query.fetchData(params).then(points => {
    //            res.status(200).json(points);
    //         });
    //       });
    //     });
    //   }
    // });
  }
};

module.exports.postData = function(req, res){
  console.log(JSON.stringify(req.body, null, ' '));
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.status(200).json({error: null, data: JSON.stringify(req.body, null, ' ')});
}

module.exports.datasources = function(req, res) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
  res.status(200).json({error: null, data: schema.datasources})
};
