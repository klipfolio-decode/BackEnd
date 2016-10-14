var request = require('request');

var options = {
  url: 'https://api.github.com/repos/BenEmdon/Tic-Tac-Toe/commits',
  headers: {
    'Authorization': 'token c5ea196043d861110c0d6364105002776ac67105',
    'user-agent': 'Klipfolio-Decode-2016'
  }
};

function callback(error, response, body) {
  console.log("entered callback");
  console.log(JSON.stringify(response));
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    console.log(JSON.stringify(info, null, '  '));
    console.log(info[0].commit.author.name);
  }
}
module.exports.makeReq = function() {
  console.log("entered function");
  request(options, callback);
}
