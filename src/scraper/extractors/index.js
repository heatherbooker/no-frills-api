/**
 * @file Extractors are used by the scraper to format the scraped data.
 */
const products = require('./productExtractor.js');
const store = require('./storeExtractor.js');

module.exports = {products, store};
