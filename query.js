var influx = require('influx')
var github = require('./github.js');
var moment = require('moment');



module.exports.getData = function(datasource,measurement, start, end, interval,filters, callback) {

  var client = influx({

    // or single-host configuration
    host: 'localhost',
    port: 8086,
    protocol: 'http',
    database: datasource
  });

  switch (datasource) {
    case 'github':
      getGithubData(measurement, start, end, interval,filters, callback,client);
  }
}
function getGithubData(measurement, start, end, interval,filters, callback,client){
   var filterQuery="";
  for(var filter in filters){
    filterQuery+="AND " +filter+ " = '" +  filters[filter] +"' ";
  };

  var query = 'SELECT sum(value) FROM ' + measurement + ' WHERE time >= ' + start + '000000000 and time <= ' + end + '000000000 '+ filterQuery+'group by time(' + interval + ') fill(0)';
  console.log(query);
  github.queryGitHub(measurement, filters['repo'], function(err, list) {
    if (!err) {
      client.writePoints(measurement, list, function(err) {

        if(!err) {
          client.query("github", query, function (err, results) {
            console.log(JSON.stringify(results, null, '  '));
            callback(err, results)
          });
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
}
