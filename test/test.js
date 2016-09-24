var mocha = require('mocha');
var assert = require('chai').assert;
var flyer = require('../src/Flyer.js');

describe('Flyer', function() {
  describe('productList', function() {
    it('should be an array', function() {
      assert.isArray(flyer.productList);
    });
  });
  describe('store associated with flyer', () => {
    describe('storeId', () => {
      it('should be a four digit number', () => {
        assert.isNumber(flyer.store.id);
        assert.lengthOf(flyer.store.id, 4, 'id is not four digits');
      });
    });
  });
  describe('product', () => {
    it('should be an object', () => {
      assert.isObject(flyer.productList[0], )
    });
    it('should have name (string) and price (number)', () => {
      assert.property(flyer.productList[0], 'name', 'product has no name');
      assert.isString(flyer.productList[0].name);
      assert.property(flyer.productList[0], 'price', 'product has no price');
      assert.isNumber(flyer.productList[0].price);
    });
  });
});
