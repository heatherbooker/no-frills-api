var assert = require('chai').assert;
var extractor = require('./productExtractor.js');


var testString = "  3.97    KRAFT PEANUT BUTTER   750g of tasty noms    ";
var result = extractor.extract(testString);

describe('extractor.extract() return value', function() {
  it('is an object', function() {
    assert.typeOf(result, 'object');
  });
  it('has price, name, and details keys which are all strings', function() {
    assert.property(result, 'price');
    assert.isString(result.price);
    assert.property(result, 'name');
    assert.isString(result.name);
    assert.property(result, 'details');
    assert.isString(result.details);
  });
  it('has no undefined or null properties', function() {
    Object.keys(result).forEach(key => {
      assert.isDefined(result[key]);
      assert.isNotNull(result[key]);
    });
  });
});

