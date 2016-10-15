var influx = require('influx')
var github = require('./github.js');
var moment = require('moment');

var client = influx({

  // or single-host configuration
  host: 'localhost',
  port: 8086,
  protocol: 'http',
  database: 'github'
})

module.exports.getData = function(measurement, start, end, interval, callback){
  var query = 'SELECT sum(value) FROM '+ measurement + ' WHERE time >= ' + start + '000000000 and time <= ' + end + '000000000 group by time(' + interval + ') fill(0)';
  console.log(query);
  github.queryGitHub('robbyrussell', 'oh-my-zsh', function(list) {

    client.writePoints(measurement, list, function(err) {

      if(!err) {
        client.query("github", query, function (err, results) {
          console.log('=========');
          console.log(JSON.stringify(results, null, '  '));
          callback(err, results)
        });
      } else {
        callback(err);
      }
    });
  });
}
