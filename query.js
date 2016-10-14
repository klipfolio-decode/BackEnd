

var influx = require('influx')


var client = influx({

  // or single-host configuration
  host: 'localhost',
  port: 8086,
  protocol: 'http',
  database: 'github'
})



function selectDB(messurment)
{

  var query = 'SELECT * FROM '+messurment;
  client.query("github", query, function (err, results) {
     console.log(results);

   })


}
