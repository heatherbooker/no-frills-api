/**
 * @file Extractors are used by the scraper to format the scraped data.
 */
const flyerExtractor = require('./flyerExtractor.js');
const storeExtractor = require('./storeExtractor.js');
const provinceExtractor = require('./provinceExtractor.js');
const cityExtractor = require('./cityExtractor.js');

module.exports = {
  extractFlyer: flyerExtractor,
  extractStores: storeExtractor,
  extractCities: cityExtractor,
  extractProvinces: provinceExtractor
};
