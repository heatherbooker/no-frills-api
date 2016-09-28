var assert = require('chai').assert;
var extractor = require('./productExtractor.js');


var testString = "  3.97    KRAFT PEANUT BUTTER   750g of tasty noms    ";

describe('extractor.extract() intended use cases', function() {

  var result = extractor.extract(testString);

  it('should return an object...', function() {
    assert.typeOf(result, 'object');
  });

  it('with price, name, and details keys which are all strings...', function() {
    assert.property(result, 'price');
    assert.isString(result.price);
    assert.property(result, 'name');
    assert.isString(result.name);
    assert.property(result, 'details');
    assert.isString(result.details);
  });

  it('and no undefined or null properties.', function() {
    Object.keys(result).forEach(key => {
      assert.isDefined(result[key]);
      assert.isNotNull(result[key]);
    });
  });

});

describe('extractor.extract() edge cases', function() {

  it('should return false when given an invalid string', function() {
    assert.isNotOk(extractor.extract('   This could be anything'));
    assert.isNotOk(extractor.extract('   This     could be anything'));
  });

  it('should return false when given other invalid inputs', function() {
    assert.isNotOk(extractor.extract(''),
      'empty string should return invalid');
    assert.isNotOk(extractor.extract(null),
      'null should return invalid');
    assert.isNotOk(extractor.extract({aNice: 'objectButThatsNotWhatWeWant'}),
      'non-string should return invalid');
    assert.isNotOk(extractor.extract(),
      'no argument should return invalid');
  });

});

