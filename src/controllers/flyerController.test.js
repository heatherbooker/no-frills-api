/* eslint no-unused-expressions: "off" */
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var Joi = require('joi');
var flyerSchema;
var endpoint;
require('../server');


describe('api v0', function() {

  beforeEach(function() {

    endpoint = 'http://localhost:8080/api/v0';

    flyerSchema = Joi.object().keys({
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
    });

  });

  describe('/flyers route', function() {

    it('should respond with Joi-approved JSON to /flyers', function(done) {
      this.timeout(500000);

      require('../noFrills.js').on('noFrills-initialized', function() {

        var flyersSchema = Joi.array().items(flyerSchema).required();

        chai.request(endpoint)
          .get('/flyers')
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

  describe('/flyers/:id route', function() {
    it('should respond with Joi-approved JSON to /flyers/:id', function(done) {

      var flyerId = '1';

      chai.request(endpoint)
        .get(`/flyers/${flyerId}`)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          Joi.validate(res.body, flyerSchema, function(error, val) {
            expect(error).to.be.null;
            done();
          });
        });
    });
  });

});
