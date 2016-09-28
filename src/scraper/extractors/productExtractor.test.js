var assert = require('chai').assert;
var extractor = require('./productExtractor.js');


describe('extractor.extract()', function() {

  it('should return an object', function() {
    var testString = "  3.97    KRAFT PEANUT BUTTER   750g of tasty noms    ";
    var result = extractor.extract(testString);
    assert.typeOf(result, 'object');
  });

  it(`should return an object with price, name, and details keys
      which are all strings...`, function() {
    var testString = "  3.97    KRAFT PEANUT BUTTER   750g of tasty noms    ";
    var result = extractor.extract(testString);
    assert.property(result, 'price');
    assert.isString(result.price);
    assert.property(result, 'name');
    assert.isString(result.name);
    assert.property(result, 'details');
    assert.isString(result.details);
  });

  it(`should return an object with no undefined or
      null properties`, function() {
    var testString = "  3.97    KRAFT PEANUT BUTTER   750g of tasty noms    ";
    var result = extractor.extract(testString);
    Object.keys(result).forEach(key => {
      assert.isDefined(result[key]);
      assert.isNotNull(result[key]);
    });
  });

  it(`should return false when given a string not
      following the expected structure`, function() {
    assert.isNotOk(extractor.extract('   This could be anything'));
    assert.isNotOk(extractor.extract('   This     could be anything'));
  });

  it('should return false when given an empty string', function() {
    assert.isNotOk(extractor.extract(''),
    'empty string should return invalid');
  });

  it('should return false when given other invalid inputs', function() {
    assert.isNotOk(extractor.extract(null),
      'null should return invalid');
    assert.isNotOk(extractor.extract({aNice: 'objectButThatsNotWhatWeWant'}),
      'non-string should return invalid');
    assert.isNotOk(extractor.extract(),
      'no argument should return invalid');
  });

});

