var assert = require('chai').assert;
var scraper = require('./index.js');
var path = require('path');


var fileData;

describe('scraper', function() {

  beforeEach(function(done) {
    scraper.scrape(function() {
      var destinationFile = path.join(__dirname, '../data/no_frills_products.json');
      fileData = require(destinationFile);
      done();
    });
  });

  it('should write a file: src/data/no_frills_products.json', function() {
    assert.isOk(fileData);
  });

  it('should write an object to the file, with array of products', function() {
    assert.isObject(fileData);
    assert.isArray(fileData.products);
  });

});
