/**
 * @file Extractors are used by the scraper to format the scraped data.
 */
const flyerExtractor = require('./flyerExtractor.js');
const storeExtractor = require('./storeExtractor.js');
const locationExtractor = require('./locationExtractors.js');

module.exports = {
  extractFlyer: flyerExtractor,
  extractStores: storeExtractor,
  extractCities: locationExtractor.extractCities,
  extractProvinces: locationExtractor.extractProvinces
};
