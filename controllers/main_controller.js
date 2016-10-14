var model = require('../query.js');
module.exports.getData = function(req, res){
    var datasource = req.params.datasource;
    var type = req.params.type;

    console.log('datasource: ' + datasource + ' type: ' + type);
    res.status(200).json({'error':null, 'data':'test data'});

};


module.exports.sampleData = function(req, res){
    var data = {'error' : null,
                'data' : [
                  {'timestamp': Date.now(), 'data': 3.452123},
                  {'timestamp': Date.now(), 'data': 3.45212343},
                  {'timestamp': Date.now(), 'data': 3.123452123}
                  ]}
    res.status(200).json(data);
};

module.exports.retrieveData = function (req,res){
  var measurement = 'commit';
  var start = 0;
  var end = 1476461799665512196;
  model.getData(measurement, start, end, res, function(results) {
      res.status(200).json(results);
  });
}
