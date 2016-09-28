var assert = require('chai').assert;
var scraper = require('./index.js');
var path = require('path');

var fileData;

var destinationFile = path.join(__dirname, '../data/no_frills_products.json');

describe('scraper', function() {

  it('should write a file, ' + destinationFile, function() {
    // It takes a while to fetch the data from the website.
    this.timeout(5000);
    scraper.scrape();
    fileData = require(destinationFile);
    assert.isOk(fileData);
  });

  it('should write an object to the file, with array of products', function() {
    assert.isObject(fileData);
    assert.isArray(fileData.products);
  });

});
