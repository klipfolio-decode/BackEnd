var influxInterface = require('../influx/InfluxInterface.js').InfluxInterface

var config = require('../config.js')
var rp = require('request-promise')

var GithubInfluxAdapter = function(params) {
  var ENDPOINT = 'https://api.github.com/repos/';

  // Use interface
  GithubInfluxAdapter.prototype = new influxInterface();
  GithubInfluxAdapter.prototype.constructor = GithubInfluxAdapter;
  influxInterface.call(this, params.datasource);

  // Options when using GitHub API. Ex. Commits
  function createOptions(repo) {
    return {
      url: ENDPOINT + repo + '/commits',
      headers: {
        //'Authorization': 'token ' + config.githubKey, // Bens access token
        'user-agent': 'Klipfolio-Decode-2016-Fall'
      }
    }
  }

  /**
  * @desc Make calls to the GitHub API to retrieve data.
  *
  * @param measurement String - The measurement we want to store into the database
  * @param owner String - The user that owns a GitHub repo.
  * @param repo String - The name of the repo we want to get dataform.
  *
  * @returns request promise
  */

  this.queryGithubData = function() {

    var options = createOptions(params.requiredFilters.repo)

    return rp(options).then( (res) => {
      var formattedResults = [];
      var data = JSON.parse(res);

      for (var i=0; i < data.length; i++){
        var time = new Date(data[i].commit.committer.date).getTime();
        var overrideTime = new Date(data[i].commit.committer.date);
        var value = (params.measurement === 'commit' ? 1 : data[i].commit.message.length);

        //console.log(new Date(data[i].commit.committer.date) + '| '+  time  +' |' + value);

        formattedResults.push(
          {
            measurement : params.measurement,
            tags : {
                author: data[i].commit.author.name,
                repo: params.requiredFilters.repo
            },
            fields: { time, value },

            timestamp: overrideTime
          }
        )
      }
    return formattedResults;
  }).catch( (error) => {
    //console.log('There was an error trying to retrieve data from GitHub: ' + error)
    return error
  })
  }

  /**
   * @desc Uses the InfluxDB inteface function to write into database.
   *
   * @param data Array - The array of points to save.
   *
   * @returns Interface storeData function
   */
  this.save = function(data){
    return this.storeData(data)
  }

  /**
   * @desc Uses the InfluxDB interface function to fetch from database.
   *
   * @param params Object - The object that holds the users params for fetching.
   *
   * @returns Interface fetchData function
   */
  this.fetch = function(){
    return this.fetchData(params)
  }
}

module.exports.GithubInfluxAdapter = GithubInfluxAdapter;
