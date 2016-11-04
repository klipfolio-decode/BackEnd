/*
* This module is the endpoint definition for time series data.
*/

var model = require('../influx/query.js');
var schema = require('../sources/schema.js');
var analysis = require("../analytics/analysis.js");
var validation = require('../sources/validation.js');


module.exports.retrieveData = function (req,res) {
  var datasource = req.params.datasource;
  var measurement = req.params.measurement;

  var queryError = validation.validate(req);

  // Validates query
  if (queryError) {
    res.status(418).json({error: queryError, data: null});
  } else {

    var start = req.query.start;
    var end = req.query.end;
    var interval = req.query.interval;
    var analysisType = req.query.analysis;

    var filters = {};

    var requiredFilters = schema.datasources[datasource].measurements[measurement].filter.required;
    var optionalFilters = schema.datasources[datasource].measurements[measurement].filter.optional;

    for(var i = 0; i < requiredFilters.length; i++) {
        filters[requiredFilters[i]] = req.query[requiredFilters[i]];
    }

    for(var i = 0; i < optionalFilters.length; i++) {
      if (req.query[optionalFilters[i]]) {
        filters[optionalFilters[i]] = req.query[optionalFilters[i]];
      }
    }

    console.log(filters);

    model.getData(datasource, measurement, start, end, interval,filters, function(err,results) {
      if(err) {
        res.status(400).json({error : err, data : null});
      } else {

        formattedResult = [];
        var array = results[0];
        for(var i = 0; i< array.length; ++i){
            formattedResult.push({'time': new Date(array[i].time).getTime(), data : array[i].sum});
        }
        if (analysisType == "lr") {
          console.log("start analysis");
          analysis.linearRegression(formattedResult, res);
        } else {
          res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
          res.status(200).json({'error' : err, 'data' : formattedResult});
        }
      }
    });
  }
}

module.exports.datasources = function(req, res) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
  res.status(200).json({error: null, data: schema.datasources})
};
