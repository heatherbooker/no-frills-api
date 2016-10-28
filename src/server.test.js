/* eslint no-unused-expressions: "off" */
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var server = require('./server.js');
var Joi = require('joi');


describe('server', function() {

  it('should respond with Joi-approved JSON to /', function(done) {

    var storesSchema = Joi.array().items(Joi.object().keys({
      code: Joi.string().max(2).required(),
      cities: Joi.array().items(Joi.object().keys({
        name: Joi.string(),
        stores: Joi.array().items(Joi.object().keys({
          address: Joi.object().required(),
          manager: Joi.any().required(),
          owner: Joi.any().required(),
          departments: Joi.array().items(Joi.string()).required(),
          hours: Joi.object().required(),
          phone_number: Joi.any().required(),
          id: Joi.string(),
          flyer_ids: Joi.array().items(Joi.string()).required()
        }))
      }))
    })).required();

    chai.request(server)
      .get('/')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        Joi.validate(res.body, storesSchema, (error, val) => {
          expect(error).to.be.null;
          done();
        });
      });
  });

  it('should respond with Joi-approved JSON to /flyers', function(done) {

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
    })).required();

    chai.request(server)
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
