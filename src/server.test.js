/* eslint no-unused-expressions: "off" */
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var server = require('./server.js');


describe('server', function() {
  it('should respond with json to /', function(done) {
    chai.request(server)
      .get('/')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);
      });
    done();
  });
  it('should respond with json to /flyers', function(done) {
    chai.request(server)
      .get('/')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);
      });
    done();
  });

});
