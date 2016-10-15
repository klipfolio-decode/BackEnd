var shaman = require('shaman');

module.exports.linearRegression = function(list){
  // console.log(realData[0].data[1].data);
  var parsedValues = [];
  var parsedDates = [];
  var parsedTimeStamps = [];
  var input = list;
  var output = {"error": null, "data": []};
  for (var i = 0; i < input.length; i++) {
    parsedValues.push(input[i].data);
  }
  for (var i = 0; i < input.length; i++) {
    parsedTimeStamps.push(input[i].time);
    parsedDates.push(i);
  }
  console.log(parsedValues);
  console.log(parsedDates);
  var x = parsedDates;
  var y = parsedValues;
  var lr = new shaman.LinearRegression(x, y);
  lr.train(function(err) {
    if (err) {
      throw err;
    }
    // you can now start using lr.predict:
    for(var i = 0; i < parsedDates.length; i++) {
        output.data.push(
          {"time": parsedTimeStamps[i],
           "data": lr.predict(i)
          });
    }
    console.log(output);
  });
  res.status(200).json(output);
};
