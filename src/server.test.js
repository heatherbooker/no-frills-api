var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();
var server = require('./server.js');


describe('server', function() {
  it('should respond with a string to home route', function(done) {
    chai.request(server)
      .get('/')
      .end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        res.should.have.property('text');
        done();
      });
  });
});
