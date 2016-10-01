var assert = require('chai').assert;
var scraper = require('./index.js');


describe('scraper', function() {

  it('should return an array of objects', function() {
    scraper.scrape().then((function(products) {
      assert.isArray(products);
      assert.isObject(products[0]);
      assert.isObject(products[products.length - 1]);
    }));
  });

});
