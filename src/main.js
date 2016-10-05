/**
 * @file Runs scraper and handles errors or prints resulting data.
 */
const scraper = require('./scraper');


scraper.scrape()
  .then(data => {
    console.log('Scraping successful; \nstore:\n' +
                  JSON.stringify(data.store, null, 2) +
                '\nfirst product:\n' +
                  JSON.stringify(data.flyer[0], null, 2));
  })
  .catch(error => {
    console.log('Error while attempting to scrape: \n', error);
  });
