/**
*  Wrapper for GitHub API.
*/

var request = require('request');
var config = require('../config.js');
var rp = require('request-promise');

var ENDPOINT = 'https://api.github.com/repos/';

// Options when using GitHub API. Ex. Commits
function createOptions(repo) {
  return {
    url: ENDPOINT + repo + '/commits',
    headers: {
      // Do we really need the token to retrieve public info from a users github??
      //'Authorization': 'token ' + config.githubKey, // Bens access token
      'user-agent': 'Klipfolio-Decode-2016-Fall',
      'Accept': 'application/vnd.github.v3+json'

    }
  };
};

/**
* @desc Make calls to the GitHub API to retrieve data.
*
* @param measurement String - The measurement we want to store into the database
* @param owner String - The user that owns a GitHub repo.
* @param repo String - The name of the repo we want to get dataform.
*
* @returns request promise
*/
module.exports.queryGithubData = function(measurement, repo){
  // Create options for GitHub API
  var options = createOptions(repo);

  // Return request promise
  return rp(options).then(res => {
    var formattedResults = [];
    var data = JSON.parse(res);

    for (var i=0; i < data.length; i++){
      var time = new Date(data[i].commit.committer.date).getTime();
      var overrideTime = new Date(data[i].commit.committer.date);
      var value = (measurement === 'commit' ? 1 : data[i].commit.message.length);

      //console.log(new Date(data[i].commit.committer.date) + '| '+  time  +' |' + value);

      formattedResults.push(
        {
          measurement : measurement,
          tags : {
              author: data[i].commit.author.name,
              repo: repo
          },
          fields: { time, value },

          timestamp: overrideTime
        }
      )
    }
    return formattedResults;
  });
};
