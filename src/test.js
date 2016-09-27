var assert = require('chai').assert;
var scraper = require('./scraper.js');

it('should be an object', function() {
  assert.typeOf(scraper, 'object', 'scraper is an object');
});
