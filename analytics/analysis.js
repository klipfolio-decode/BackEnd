var timeseries = require('timeseries-analysis');


module.exports.analysis = function(req, res){
  console.log(req.body);
  var data = req.body.data;

  var formatData = [];

  for (var i = 0; i < data.length; i++) {

    formatData.push({
      time : new Date(data[i].time),
      data : data[i].sum
    });
  }

  console.log(formatData);

  var t = new timeseries.main(timeseries.adapter.fromDB(formatData, {
    date: 'time',
    value: 'data'
  }));


  t.smoother({period:4}).save('smoothed');
  var bestSettings = t.regression_forecast_optimize();

  if (bestSettings === undefined){
    res.status(416).json({error: 'Sample size too small', data: null});
  }

  //console.log(bestSettings);
  // Apply those settings to forecast the n+1 value
  t.sliding_regression_forecast({
      sample:		bestSettings.sample,
      degree: 	bestSettings.degree,
      method: 	bestSettings.method
  });
  var chart_url = t.chart({main:false,points:[{color:'FFFFFF',point:bestSettings.sample,serie:0}]});

  var formattedResult = [];
  for (var i = 0; i < t.data.length; i++){
    formattedResult.push({
      'time' : t.data[i][0],
      'data' : t.data[i][1]
    });
  }

  res.status(200).json({error: null, data:formattedResult});
}
