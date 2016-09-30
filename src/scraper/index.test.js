var assert = require('chai').assert;
var scraper = require('./index.js');
var path = require('path');


var fileData;

describe('scraper', function() {

  it('should write a file: src/data/no_frills_products.json', function() {
    scraper.scrape().then(function() {
      var filePath = path.join(__dirname, '../data/no_frills_products.json');
      fileData = require(filePath);
      assert.isOk(fileData);
    });
  });

  it('should write an object to the file, with array of products', function() {
    scraper.scrape().then(function() {
      var filePath = path.join(__dirname, '../data/no_frills_products.json');
      fileData = require(filePath);
      assert.isObject(fileData);
      assert.isArray(fileData.products);
    });
  });

});
