

var influx = require('influx')


var client = influx({

  // or single-host configuration
  host: 'localhost',
  port: 8086,
  protocol: 'http',
  database: 'mydb'
})


module.exports.getData = function(measurement, start, end, callback){
  var query = 'SELECT sum(value) FROM '+ measurement + ' WHERE time > now() - 30d and time < now() group by time(1d) fill(0)';
  var output = client.query("mydb", query, function (err, results) {
    callback(err,results);
  });
}
