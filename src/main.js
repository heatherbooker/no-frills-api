/**
 * @file Runs scraper and handles errors or prints resulting data.
 */
var scraper = require('./scraper');


scraper.scrape()
  .then(function(filePath) {
    console.log('Scraping successful; data can be found at "' + filePath + '"');
  })
  .catch(function(error) {
    console.log('Error while attempting to scrape: \n', error);
  });

