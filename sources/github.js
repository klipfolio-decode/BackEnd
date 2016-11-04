/**
*  Wrapper for GitHub API.
*/

var request = require('request');
var config = require('../config.js');
var rp = require('request-promise');

var ENDPOINT = 'https://api.github.com/repos/';

// Options when using GitHub API. Ex. Commits
function createOptions(owner, repo) {
  return {
    url: ENDPOINT + owner + '/'+ repo + '/commits',
    headers: {
      'Authorization': 'token ' + config.githubKey, // Bens access token
      'user-agent': 'Klipfolio-Decode-2016-Fall'
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
module.exports.queryGithubData = function(measurement, owner, repo){
  // Create options for GitHub API
  var options = createOptions(owner, repo);
  // Return request promise
  return rp(options).then(res => {
    var formattedResults = [];
    var data = JSON.parse(res);

    for (var i=0; i < data.length; i++){
      var time = new Date(data[i].commit.committer.date).getTime();
      var overrideTime = new Date(data[i].commit.committer.date);
      var value = (measurement === 'commit' ? 1 : data[i].commit.message.length);

      console.log(new Date(data[i].commit.committer.date) + '| '+  time  +' |' + value);

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



module.exports.queryGitHub = function(measurement, owner, repo, callback) {
  var options = createOptions(owner, repo);
  // Make a HTTPS GET request to GitHubs API.
  request(options, function(error, response, body) {
    // Check for errors
    if (error) {
      callback(error, null);
    }
    // Check for correct status code
    if (response.statusCode !== 200) {
      callback("Invalid stauts code returned: " + response.statusCode, null);
    }

    var result = [];
    var info = JSON.parse(body);

    // Parse the data and add put it into an array.
    for(var i=0; i <info.length; i++) {
      result.push(
        [
          {
            time : new Date(info[i].commit.committer.date).getTime(),
            value: (measurement === 'commit' ? 1 : info[i].commit.message.length)
          },
          {
            author: info[i].commit.author.name,
            repo: repo
          }
        ]);
    }
    callback(error, result);
  });
};
