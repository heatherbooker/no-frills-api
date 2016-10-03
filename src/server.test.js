var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();
var server = require('./server.js');



describe.only('server', function() {
  it('should respond with "Hello World!" to home route', function(done) {
    chai.request(server)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.have.property('text');
        res.text.should.equal('Hello World!');
        done();
      });
  });
});
