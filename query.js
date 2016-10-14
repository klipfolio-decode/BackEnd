

var influx = require('influx')


var client = influx({

  // or single-host configuration
  host: 'localhost',
  port: 8086,
  protocol: 'http',
  database: 'github'
})

var insertDB= function(messurment,list)
{
  //ribaz
  client.writePoints(messurment,  list);
}


module.exports.getData = function(measurement, start, end, callback){
  var query = 'SELECT sum(value) FROM '+ measurement + ' WHERE time > now() - 30d and time < now() group by time(1d)';

  var output = client.query("mydb", query, function (err, results) {
    callback(results);
  });
}

module.exports.insertDB=insertDB;
