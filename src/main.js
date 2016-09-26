/**
 * @file Runs scraper and handles errors or prints resulting data.
 */
var scraper = require('./scraper.js');

var fileName = '"src/data/no_frills_products.json"';

try {
  scraper.scrape();
  console.log('Scraping successful; data can be found at ' + fileName);
} catch (error) {
  if (error.message === 'phantomjsNotFound') {
    console.log('Error - are you sure you have phantomjs installed?');
    process.exit(5);
  } else if (error.message === 'errorOpeningPage') {
    console.log('Error opening page; are you sure the URL is correct?');
  } else {
    console.log('Error running scraper: ', error);
  }
}
