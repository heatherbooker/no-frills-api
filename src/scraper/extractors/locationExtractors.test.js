var assert = require('chai').assert;
var request = require('request');
var extractor = require('./locationExtractors.js');

describe('province extractor', function() {
  it('should return an array of two-letter province codes', function() {
    var testProvinceData = JSON.stringify({
      "gsCartYtdWeekRange": "Jan 1, 2016 - Oct 13, 2016",
      "departmentId": {
        "pharmacy": "300064",
        "medicalClinics": "300048",
        "naturalFoods": "300050"
      },
      "provincePrompt": [{
        "label": "AB",
        "value": "Alberta",
        "defaultLocale": null
      }, {
        "label": "BC",
        "value": "British Columbia",
        "defaultLocale": null
      }, {
        "label": "MB",
        "value": "Manitoba",
        "defaultLocale": null
      }, {
        "label": "NB",
        "value": "New Brunswick",
        "defaultLocale": null
      }, {
        "label": "NL",
        "value": "Newfoundland and Labrador",
        "defaultLocale": null
      }, {
        "label": "NS",
        "value": "Nova Scotia",
        "defaultLocale": null
      }, {
        "label": "ON",
        "value": "Ontario",
        "defaultLocale": null
      }, {
        "label": "PE",
        "value": "Prince Edward Island",
        "defaultLocale": null
      }, {
        "label": "SK",
        "value": "Saskatchewan",
        "defaultLocale": null
      }],
      "storeLocator": {
        "defaultSearch": "Toronto",
        "mapDefaults": {
          "mapType": "ROADMAP",
          "center": {
            "lng": -79.365234,
            "lat": 43.707594
          },
          "zoom": 4,
          "zoomDetail": 15
        }
      }
    });
    var result = extractor.extractProvinces(testProvinceData);
    assert.isArray(result);
    assert.lengthOf(result[0], 2);
  });
});

describe('city extractor', function(done) {

  it('should return an array of objects', function() {
    var endpoint = `http://www.nofrills.ca/en_CA/store-list-page.BC.html`;
    request(endpoint, function(err, response, body) {
      if (err) {
        return false;
      }
      var result = extractor.extractCities(body);
      assert.isArray(result);
      assert.isObject(result[0]);
      done();
    });
  });

  it('should error given a non html input', function() {
    try {
      extractor.extractCities(`{beautiful: "object"}`);
      return false;
    } catch (err) {
      return true;
    }
  });
});
