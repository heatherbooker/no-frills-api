var assert = require('chai').assert;
var extract = require('./productExtractor.js');

describe('product extractor', function() {

  it(`should return an array with objects of 7 keys each`, function() {
    var testProduct = [{
      correctionNotice: null,
      description: `<span style="color:#000000;">1 LB TRAY<br />↵product of U.S.A., no.1 grade /<br />↵<br />↵fraises</span>`,
      flyerUrl: null,
      img: `http://content.flyerservices.com/xmlpublicationservice.svc/lcl/NOFR/images/4cc14178-d794-4806-a978-2a5adb8b9c54/214x214`,
      itemDetailsUrl: null,
      points: null,
      priceSavings: "n/a",
      priceString: "1.87",
      productTitle: "STRAWBERRIES",
      rank: 0
    }];
    var result = extract(testProduct);
    assert.isArray(result);
    result.forEach(product => {
      assert.isObject(product);
      assert.lengthOf(Object.keys(product), 7);
    });
  });

  it('should throw an error given a non-array input', function() {
    try {
      extract({an: 'object'});
      return false;
    } catch (err) {
      return true;
    }
  });

  it(`should throw an error given an array not containing objects`, function() {
    try {
      extract(['just a string', 2, 'another',
                        true, {single: 'object'}]);
      return false;
    } catch (err) {
      return true;
    }
  });

  it('should throw an error given more than one input', function() {
    try {
      extract(['first array', 'things in it'], {could: 'beAnObject'});
      return false;
    } catch (err) {
      return true;
    }
  });

});
