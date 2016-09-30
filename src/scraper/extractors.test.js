var assert = require('chai').assert;
var extract = require('./extractors.js');

describe('product extractor', function() {

  it(`should return an array with objects which have no null or undefined fields`, function() {
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
    var result = extract.products(testProduct);
    assert.isArray(result);
    Object.keys(result[0]).forEach(function(key) {
      assert.isOk(key, result[0][key]);
    });
  });

  it('should throw an error given a non-array input', function() {
    try {
      extract.products({an: 'object'});
      return false;
    } catch (err) {
      return true;
    }
  });

  it('should throw an error given an array not containing objects', function() {
    try {
      extract.products(['just a string', 2, 'another', true, {single: 'object'}]);
      return false;
    } catch (err) {
      return true;
    }
  });

  it('should throw an error given more than one input', function() {
    try {
      extract.products(['first array', 'things in it'], {could: 'beAnObject'});
      return false;
    } catch (err) {
      return true;
    }
  });

});
