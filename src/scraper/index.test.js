var assert = require('chai').assert;
var scraper = require('./index.js');


describe('scraper', function() {

  it('should be an object', function() {
    assert.typeOf(scraper, 'object', 'scraper is an object');
  });

});
