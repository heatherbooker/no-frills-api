var assert = require('chai').assert;
var scraper = require('./index.js');


describe('scraper', function() {

  it('should return an array containing objects', function() {
    scraper.scrape().then((function(stores) {
      assert.isArray(stores);
      assert.isObject(stores[0]);
    }));
  });

});
