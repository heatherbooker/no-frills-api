var assert = require('chai').assert;
var scrape = require('./index.js');


describe('store scraper', function() {

  it('should return an object', function() {
    const storeId = '200';
    scrape.store(storeId).then((function(store) {
      assert.isObject(store);
      assert.lengthOf(Object.keys(store), 2);
    }));
  });

  it('should error, given an invalid store id', function() {
    const storeId = '0';
    scrape.store(storeId)
      .then(function() {
        return false;
      })
      .catch(function() {
        return true;
      });
  });

});

describe('flyer scraper', function() {

  it('should return an array', function() {
    const storeId = '200';
    scrape.flyer(storeId).then((function(flyer) {
      assert.isArray(flyer);
    }));
  });

  it('should error, given an invalid store id', function() {
    const storeId = '0';
    scrape.flyer(storeId)
      .then(function() {
        return false;
      })
      .catch(function() {
        return true;
      });
  });

});
