var request = require('request');
var config = require('../config.js');

function createOptions(repo) {
  return {
    url: 'https://api.github.com/repos/' + repo + '/commits',
    headers: {
      'Authorization': 'token ' + config.githubKey, // Bens access token
      'user-agent': 'Klipfolio-Decode-2016-Fall'
    }
  };
}

var queryGitHub = function(measurement, repo, callback) {

  var options = createOptions(repo);

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var result = [];
      var info = JSON.parse(body);
      for(var i = 0; i < info.length; i++) {
        result.push([{
          time: new Date(info[i].commit.committer.date).getTime(),
          value: (measurement === 'commit' ? 1 : info[i].commit.message.length)
        }, {
          author: info[i].commit.author.name,
          repo: repo
        }])
      }
      // console.log(JSON.stringify(list, null, '  '));
      callback(error, result);
    } else if (!error) {
      callback("body: " + JSON.stringify(response, null, '  '), null);
    } else {
      callback(error, null);
    }
  });
}

module.exports.queryGitHub = queryGitHub;
