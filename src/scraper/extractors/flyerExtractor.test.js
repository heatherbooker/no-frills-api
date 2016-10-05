var assert = require('chai').assert;
var extract = require('./flyerExtractor.js');

describe('flyer extractor', function() {

  it('should return an object with 3 keys', function() {
    var testFlyer = {
      bannerUrl: 'whateverwhateverhatever',
      weekRange: 'Thursday Sept 12 - Wednesday Sept 18',
      flyerResponse: {
        bannerUrl: null,
        weekRange: null,
        docs: [{
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
        }]
      }
    };
    const result = extract(testFlyer);
    assert.isObject(result);
    assert.lengthOf(Object.keys(result), 3);
  });

  it('should throw an error given a non-object input', function() {
    try {
      extract([{an: 'object'}, "how did this get here"]);
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
