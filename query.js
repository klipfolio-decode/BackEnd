var influx = require('influx')
var github = require('./github.js');

var client = influx({

  // or single-host configuration
  host: 'localhost',
  port: 8086,
  protocol: 'http',
  database: 'github'
})


var insertDB= function(messurment, list)
{
  //ribaz
  client.writePoints(messurment,  list);
}

module.exports.getData = function(measurement, start, end, interval, res, callback){
  var query = 'SELECT sum(value) FROM '+ measurement + ' WHERE time >= ' + start + ' and time <= ' + end + ' group by time(' + interval + ') fill(0)';

  github.queryGitHub('robbyrussell', 'oh-my-zsh', function(list) {

    client.writePoints(measurement, list, function(err) {

      if(!err) {
        client.query("github", query, function (err, results) {

          // console.log(JSON.stringify(results, null, '  '));
          if(!err) {
            callback(results); // from the initaial param
          } else {
            console.error(err);
            res.status(500).json(err);
          }
        });
      } else {
        console.error(err);
        res.status(500).json(err);
      }
    });
  });
}
