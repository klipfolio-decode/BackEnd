var influx = require('influx')
var github = require('../sources/github.js');
var moment = require('moment');


// Creates a new Influx client, sets the default database to 'github'
var client = new influx.InfluxDB({
  host: 'localhost',
  port: 8086,
  protocol: 'http',
  database: 'github'
});

/**
* @desc Checks the database whether the datasource already exists.
*
* @param datasource - name of the datasource to check
*
* @returns Promise
*/
module.exports.checkDataSourceExists = function(datasource) {
  return client.getDatabaseNames()
    .then(names => {
      return (names.indexOf(datasource) >= 0) ? true : false;
    })
    .catch(err => {
      console.error('Error getting InfluxDB database names! ' + err);
    });
};

/**
* @desc Create database with datasource name.
*
* @param datasource - name of the datasource to check
*
* @returns Promise
*/
module.exports.createDatabase = function(datasource) {
  return client.createDatabase(datasource).then(()  => {
    console.log('Created database for datasource: ' + datasource);
  })
  .catch(err => {
    console.log('Error trying to create database: ' + err);
  });
};


/**
* @desc Writes points into database
*
* @param data - Dictionary of params that were passed in url query
*
* @returns Promise - That the data was stored into the database.
*/
module.exports.storeData = function(data) {
  // Get GitHub Data
  var measurement = data.measurement;
  var repo = data.requiredFilters.repo;

  return github.queryGithubData(measurement, repo).then(points => {
    console.log(points);
    client.writePoints(points).catch(err => {
      console.log('Error writing to db: ' + err);
    });

  })
  .catch(err => {
    console.log('There was an error using GitHub API.' + err);
  });
};

/**
* @desc Fetch data from database based on params given.
*
* @param data - Dictionary of params that were passed in url query.
*
* @returns Promise - The future data from the database.
*/
module.exports.fetchData = function(data) {
  var requiredFilterQuery = '';
  var optionalFilterQuery = '';

  for (var filter in data.requiredFilters){
    if (filter !== 'owner'){
      requiredFilterQuery += "AND " + filter + " = '" + data.requiredFilters[filter] + "' ";
    }
  }

  for (var filter in data.optionalFilters){
    if (filter !== 'owner'){
      optionalFilterQuery += "OR " + filter + " = '" + data.optionalFilters[filter] + "' ";
    }
  }

  var query = 'SELECT sum(value) FROM ' + data.measurement +
              ' WHERE time >= ' + data.start + '000000000 and time <= ' + data.end + '000000000 ' +
              requiredFilterQuery + 'group by time(' + data.interval + ') fill(0)';

  console.log(query);

  return client.query(query).then(res => {
      return res;
  })
  .catch(err => {
      console.log('An error occurred when trying to fetch data: ' + err);
  });
}
