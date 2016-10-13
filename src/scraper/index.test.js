var assert = require('chai').assert;
var scraper = require('./index.js');


describe('store scraper', function() {

  it('should return an array containing objects', function() {
    scraper.scrapeStores().then((function(stores) {
      assert.isArray(stores);
      assert.isObject(stores[0]);
    }));
  });

});
