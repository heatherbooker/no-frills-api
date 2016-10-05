var assert = require('chai').assert;
var scraper = require('./index.js');


describe('flyer scraper', function() {

  it('should return an array of objects', function() {
    scraper.scrapeFlyer().then((function(products) {
      assert.isArray(products);
      assert.isObject(products[0]);
      assert.isObject(products[products.length - 1]);
    }));
  });

});

describe('store scraper', function() {

  it('should return an object', function() {
    scraper.scrapeStore().then((function(store) {
      assert.isObject(store);
    }));
  });

});
