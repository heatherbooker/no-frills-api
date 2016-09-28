var assert = require('chai').assert;
var scraper = require('./index.js');
var path = require('path');

var fileData;

var destinationFile = path.join(__dirname, '../data/no_frills_products.json');


describe('scraper', function() {

  beforeEach(function() {
    // It takes a while to fetch the data from the website.
    this.timeout(7000);
    scraper.scrape();
    fileData = require(destinationFile);
  });

  it('should write a file, ' + destinationFile, function() {
    assert.isOk(fileData);
  });

  it('should write an object to the file, with array of products', function() {
    assert.isObject(fileData);
    assert.isArray(fileData.products);
  });

});
