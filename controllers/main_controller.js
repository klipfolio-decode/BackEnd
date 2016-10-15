var model = require('../query.js');
var schema = require('../schema.js');
var analysis = require("../analysis.js");
var validation = require('../validation.js')

module.exports.getData = function(req, res){
    var datasource = req.params.datasource;
    var type = req.params.type;

    console.log('datasource: ' + datasource + ' type: ' + type);
    res.status(200).json({error: null, data:'test data'});
};


module.exports.sampleData = function(req, res){
    var data = {error : null,
                data : [
                  {'timestamp': Date.now(), data: 3.452123},
                  {'timestamp': Date.now(), data: 3.45212343},
                  {'timestamp': Date.now(), data: 3.123452123}
                  ]}
    res.status(200).json(data);
};

module.exports.retrieveData = function (req,res){
  var datasource = req.params.datasource;
  var measurement = req.params.measurement;

  var queryError = validation.validate(req);
  console.log(queryError);
  if (queryError) {
    res.status(418).json({error: queryError, data: null});
  } else {
    var start = req.query.start;
    var end = req.query.end;
    var interval = req.query.interval;
    var analysisType = req.query.analysis;

      var filters ={};
      var requiredFilters = schema.datasources[datasource].measurements[measurement].filter.required;
      for(var i = 0; i<requiredFilters.length; i++)
      {
          filters[requiredFilters[i]] = req.query[requiredFilters[i]];
          // filters.push({filter:requiredFilters[i], value:req.query[requiredFilters[i]]});
      }
        console.log(filters);
    model.getData(datasource,measurement, start, end, interval,filters, function(err,results) {
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
          res.status(200).json({'error' : err, 'data' : formattedResult});
        }
      }
    });
  }
}

module.exports.datasources = function(req, res) {
  res.status(200).json({error: null, data: schema.datasources})
};
