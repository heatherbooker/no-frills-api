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

      var storesSchema = Joi.array().items(storeSchema).required();

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

  describe('/:id/flyers route', function() {
    it(`should respond with Joi-approved JSON to /stores/:id/flyers`, function(done) {

      var storeId = '3946';
      var flyersSchema = Joi.array().items(Joi.object().keys({
        products: Joi.array().items(Joi.object().keys({
          productTitle: Joi.string().required(),
          priceString: Joi.string().required(),
          priceSavings: Joi.any().required(),
          description: Joi.any().required(),
          correctionNotice: Joi.any().required(),
          img: Joi.string().required(),
          french: Joi.any().required()
        })).required(),
        id: Joi.string().required(),
        store_id: Joi.string().required(),
        start_date: Joi.string().required(),
        end_date: Joi.string().required()
      }));

      chai.request(endpoint)
        .get(`/stores/${storeId}/flyers`)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          Joi.validate(res.body, flyersSchema, function(error, val) {
            expect(error).to.be.null;
            done();
          });
        });
    });
  });
});
