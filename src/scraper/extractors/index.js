/**
 * @file Extractors are used by the scraper to format the scraped data.
 */
var products = require('./productExtractor.js');
var store = require('./storeExtractor.js');

module.exports = {products, store};
