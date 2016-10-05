var assert = require('chai').assert;
var scraper = require('./index.js');


describe('scraper', function() {

  it('should return an object containing an array and an object', function() {
    scraper.scrape().then((function(data) {
      assert.isObject(data);
      assert.lengthOf(Object.keys(data), 2);
      assert.isArray(data.flyer);
      assert.isObject(data.store);
    }));
  });

});
