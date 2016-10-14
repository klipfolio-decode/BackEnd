var request = require('request');

function createOptions(username, repo) {
  return {
    url: 'https://api.github.com/repos/' + username + '/' + repo + '/commits',
    headers: {
      'Authorization': 'token 164457e327f031273634df309b970909d800d8ff', // Bens access token
      'user-agent': 'Klipfolio-Decode-2016-Fall'
    }
  };
}

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var list = [];
    var info = JSON.parse(body);

    for(var i = 0; i < info.length; i++) {
      list.push({
        author:info[i].commit.author.name,
        date:info[i].commit.committer.date
      })
    }
    console.log(JSON.stringify(list, null, '  '));
  } else if (!error) {
    console.log("body: " + JSON.stringify(response, null, '  '));
  } else {
    console.error(error);
  }
}

var queryGitHub = function(username, repo, callback) {
  var options = createOptions(username, repo);

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var list = [];
      var info = JSON.parse(body);

      for(var i = 0; i < info.length; i++) {
        list.push({
          author: info[i].commit.author.name,
          time: new Date(info[i].commit.committer.date).getTime(),
          value: 1
        })
      }
      console.log(JSON.stringify(list, null, '  '));
      callback(list);

    } else if (!error) {
      console.log("body: " + JSON.stringify(response, null, '  '));
    } else {
      console.error(error);
    }
  });
}

module.exports.queryGitHub = queryGitHub;
