var chai = require('chai');
var chaiHttp = require('chai-http');
var GithubInfluxAdapter = require('../sources/GithubInfluxAdapter.js').GithubInfluxAdapter

var should = chai.should();

var server = 'http://localhost:8080';
chai.use(chaiHttp);

describe('Query data using GitHub API with correct params', function(){
  var githubInfluxAdapter;

  beforeEach(function(){

    var params = {
      datasource: 'github',
      measurement: 'commit',
      start: '1475352578',
      end: '1478376578',
      interval: '1d',
      requiredFilters: { repo: 'facebook/react' },
      optionalFilters: { author: undefined }
    };

    githubInfluxAdapter = new GithubInfluxAdapter(params);
  });

  it('Should return data from GitHub API', function(done){
    githubInfluxAdapter.queryGithubData().then(res => {
        should.exist(res);
        res.should.be.array;
        res.should.be.not.empty;
        done();
      });
  });

  it('Should return the data in the correct format to put into InfluxDB', function(done){
    githubInfluxAdapter.queryGithubData().then(res => {
      res.forEach(point => {
        point.should.have.property('measurement').not.empty;
        point.should.have.property('tags').not.empty;
        point.should.have.property('fields').not.empty;
        point.should.have.property('timestamp').to.not.be.null;
      });
      done();
    });
  });
});

describe('Query data using GitHub API with incorrect params', function(){
  it('Should return 404 from incorrect repo format', function(done){

    var params = {
      datasource: 'github',
      measurement: 'commit',
      start: '1475352578',
      end: '1478376578',
      interval: '1d',
      requiredFilters: { repo: 'fail' },
      optionalFilters: { author: undefined }
    };

    githubInfluxAdapter = new GithubInfluxAdapter(params);

    githubInfluxAdapter.queryGithubData().then((error) =>{
      error.statusCode.should.equal(404);
      done();
    })
  });
});

describe('Get available schemas', function(){
  it('Should return schemas', function(done){
    chai.request(server)
        .get('/data')
        .end(function(err, res){
          res.should.have.status(200);
          res.should.be.json;

          // Check if the data object is correct
          res.body.should.have.property('error');
          res.body.should.have.property('data');

          should.not.exist(res.body.error);
          should.exist(res.body.data);

          done();
        });
  });
});
