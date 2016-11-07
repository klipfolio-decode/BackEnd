/**
 * Interface for InfluxDB
 */
var influx = require('influx')

var InfluxInterface = function(datasource){
    // Create a new client based on the datasource given.
    var influxClient = new influx.InfluxDB({
      host: 'localhost',
      port: 8086,
      protocol: 'http',
      database: datasource
    })

    /**
    * @desc Checks the database whether the datasource already exists.
    *
    * @param datasource - name of the datasource to check
    *
    * @returns Promise
    */
    this.checkDataSourceExists = function(datasource){
      return influxClient.getDatabaseNames()
        .then( (names) => {
          return (names.indexOf(datasource) >= 0) ? true : false
        })
        .catch( (error) => {
          console.error('Error getting InfluxDB database names! ' + error);
        })
    }

    /**
    * @desc Create database with datasource name.
    *
    * @param datasource - name of the datasource to check
    *
    * @returns Promise
    */
    this.createDatabase = function(datasource){
      return influxClient.createDatabase(datasource)
        .then( () => {
          console.log('Created database for datasource: ' + datasource);
        })
        .catch( (error) => {
          console.log('Error trying to create database: ' + error);
        })
    }

    /**
    * @desc Writes points into database
    *
    * @param points - Array of points to write into database.
    *
    * @returns Promise - That the data was stored into the database.
    */
    this.storeData = function(points){
      return influxClient.writePoints(points)
        .catch( (error) => {
          console.log('Error writing to db: ' + error);
        })
    }

    /**
    * @desc Fetch data from database based on params given.
    *
    * @param data - Dictionary of params that were passed in url query.
    *
    * @returns Promise - The future data from the database.
    */
    this.fetchData = function(data){
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

      return influxClient.query(query).then(res => {
          return res;
      })
      .catch(err => {
          console.log('An error occurred when trying to fetch data: ' + err);
      });
    }
}

module.exports.InfluxInterface = InfluxInterface;
