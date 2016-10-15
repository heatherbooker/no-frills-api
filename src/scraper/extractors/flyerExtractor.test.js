var assert = require('chai').assert;
var extract = require('./flyerExtractor.js');

describe('flyer extractor', function() {

  it('should return an array with an object with 4 keys', function() {
    const testFlyer = {
      bannerUrl: 'whateverwhateverhatever',
      weekRange: 'Thursday Sept 12 - Wednesday Sept 18',
      flyerUrl: "/en_CA/flyers.banner@NOFR.storenum@3410.week@current.html",
      flyerResponse: {
        bannerUrl: null,
        weekRange: null,
        docs: [{
          correctionNotice: null,
          description: `<span style="color:#000000;">1 LB TRAY<br />↵product of U.S.A., no.1 grade /<br />↵<br />↵fraises</span>`,
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
    const result = extract(JSON.stringify(testFlyer));
    assert.isArray(result);
    assert.isObject(result[0]);
    assert.lengthOf(Object.keys(result[0]), 4);
  });

  it('should return null given a flyer with all null values', function() {
    const testFlyer = {
      bannerUrl: null,
      weekRange: null,
      flyerResponse: {
        bannerUrl: null,
        weekRange: null,
        docs: [{
          correctionNotice: null,
          flyerUrl: null,
          itemDetailsUrl: null,
          points: null
        }]
      }
    };
    const result = extract(JSON.stringify(testFlyer));
    assert.isNull(result);
  });

  it('should throw an error given a non-JSON string input', function() {
    try {
      extract(`this is not valid JSON! [{an: 'object'}, "how here"]`);
      return false;
    } catch (err) {
      return true;
    }
  });

  it(`should throw an error given an array not containing objects`, function() {
    try {
      extract(`['just a string', 2, 'another',
                        true, {single: 'object'}]`);
      return false;
    } catch (err) {
      return true;
    }
  });

  it('should throw an error given more than one input', function() {
    try {
      extract(`['first array', 'things in it'], {could: 'beAnObject'}`);
      return false;
    } catch (err) {
      return true;
    }
  });

});
