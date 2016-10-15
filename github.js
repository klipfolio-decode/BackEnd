var request = require('request');

function createOptions(username, repo) {
  return {
    url: 'https://api.github.com/repos/' + username + '/' + repo + '/commits',
    headers: {
      'Authorization': 'token 2376e01358d25514cda74aec178a2573c849fcaa', // Bens access token
      'user-agent': 'Klipfolio-Decode-2016-Fall'
    }
  };
}

var queryGitHub = function(username, repo, callback) {

  var options = createOptions(username, repo);

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var list = [];
      var info = JSON.parse(body);
      for(var i = 0; i < info.length; i++) {
        list.push([{
          time: new Date(info[i].commit.committer.date).getTime(),
          value: 1
        }, {
          author: info[i].commit.author.name,
          repo: repo
        }])
      }
      console.log(JSON.stringify(list, null, '  '));
      callback(list);
    } else if (!error) {
      console.error();("body: " + JSON.stringify(response, null, '  '));
    } else {
      console.error(error);
    }
  });
}

module.exports.queryGitHub = queryGitHub;
