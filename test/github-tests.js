var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var server = 'http://localhost:8080';

chai.use(chaiHttp);

describe('Data Source Schema', function(){
  it('GET datasource schema || should output schema', function(done){
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
