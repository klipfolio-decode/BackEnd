var request = require('request');

var options = {
  url: 'https://api.github.com/repos/BenEmdon/Tic-Tac-Toe/commits', // TODO make dynamic
  headers: {
    'Authorization': 'token c5ea196043d861110c0d6364105002776ac67105', // bens access token
    'user-agent': 'Klipfolio-Decode-2016-Fall'
  }
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var list = [];
    var info = JSON.parse(body);

    for(var i = 0; i < info.length; i++) {
      list.push({
        name:info[i].commit.author.name,
        date:info[i].commit.committer.date
      })
    }
    console.log(JSON.stringify(list, null, '  '));
  } else {
    console.log("Failed: " + error + "\t" + response.statusCode);
  }
}
module.exports.makeReq = function() {
  request(options, callback);
}
