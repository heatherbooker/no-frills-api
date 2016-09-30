/**
 * @file Runs scraper and handles errors or prints resulting data.
 */
var scraper = require('./scraper');


try {
  scraper.scrape().then(function(filePath) {
    console.log('Scraping successful; data can be found at "' + filePath + '"');
  });
} catch (error) {
  console.log(error.message);
}
