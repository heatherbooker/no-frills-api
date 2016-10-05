/**
 * @file Extractors are used by the scraper to format the scraped data.
 */
const flyer = require('./flyerExtractor.js');
const store = require('./storeExtractor.js');

module.exports = {flyer, store};
