/**
 * @file Runs scraper and handles errors or prints resulting data.
 */
var scraper = require('./scraper');


try {
  var filePath = scraper.scrape();
  console.log('Scraping successful; data can be found at "' + filePath + '"');
} catch (error) {
  console.log(error.message);
}
