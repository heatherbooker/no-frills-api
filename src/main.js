/**
 * @file Runs scraper and handles errors or prints resulting data.
 */
const scraper = require('./scraper');


scraper.scrape()
  .then(products => {
    console.log('Scraping successful; first product:\n' +
                  JSON.stringify(products[0], null, 2));
  })
  .catch(error => {
    console.log('Error while attempting to scrape: \n', error);
  });
