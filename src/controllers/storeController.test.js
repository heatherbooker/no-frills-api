/* eslint no-unused-expressions: "off" */
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var Joi = require('joi');
var storeSchema;
var endpoint;
require('../server');


describe('api v0 /stores routes', function() {

  beforeEach(function() {

    endpoint = 'http://localhost:8080/api/v0';

    storeSchema = Joi.object().keys({
      address: Joi.object().required(),
      manager: Joi.any().required(),
      owner: Joi.any().required(),
      departments: Joi.array().items(Joi.string()).required(),
      hours: Joi.object().required(),
      phone_number: Joi.any().required(),
      id: Joi.string(),
      flyer_ids: Joi.array().items(Joi.string()).required()
    }).required();

  });

  describe('/', function() {

    it('should respond with Joi-approved JSON to /stores', function(done) {
      this.timeout(500000);

      var storesSchema = Joi.array().items(Joi.object().keys({
        code: Joi.string().max(2).required(),
        cities: Joi.array().items(Joi.object().keys({
          name: Joi.string(),
          stores: Joi.array().items(storeSchema)
        }))
      })).required();

      chai.request(endpoint)
        .get('/stores')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          Joi.validate(res.body, storesSchema, function(error, val) {
            expect(error).to.be.null;
            done();
          });
        });
    });
  });


  describe('/:id route', function() {
    it('should respond with Joi-approved JSON to /stores/:id', function(done) {

      var storeId = '3946';

      chai.request(endpoint)
        .get(`/stores/${storeId}`)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          Joi.validate(res.body, storeSchema, function(error, val) {
            expect(error).to.be.null;
            done();
          });
        });
    });
  });
});
