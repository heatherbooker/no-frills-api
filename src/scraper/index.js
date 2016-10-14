/**
 * @file Makes http requests to nofrills to get store and flyer data.
 */
const request = require('request');
const extractor = require('./extractors');


function scrapeStores() {

  // Start by just getting the list of provinces.
  const firstExtraction = {
    identity: 'provinces',
    endpoint: `http://www.nofrills.ca/banners/global/v1/en_CA/nofrills`,
    extractor: extractor.extractProvinces
  };
  const extractions = [firstExtraction];
  const results = [];

  function runExtractions(extractions) {
    var promise = new Promise((resolve, reject) => {
      while (extractions.length > 0) {

        if (extractions[0].endpoint) {
          const extraction = extractions[0];
          getPromiseToGetThing(extraction.endpoint, extraction.extractor)
            .then(newExtractions => {
              newExtractions.forEach(extraction => {
                extractions.push(extraction);
              });
              runExtractions(extractions);
            });

        } else {
          results.push(extractions[0]);
        }

        extractions.shift();

        if (extractions.length === 0) {
          resolve(results);
        }
      }
    });
    return promise;
  }

  return runExtractions(extractions);
}


function getPromiseToGetThing(options, extractorToUse, delay = 1) {

  const promise = new Promise((resolve, reject) => {

    setTimeout(() => {
      request(options, (error, response, body) => {
        if (error) {
          return reject(`Request to ${options} failed: ${error}`);
        }

        if (body === '') {
          // Send it back to be tried again a little later.
          resolve({
            endpoint: options,
            extractor: extractorToUse,
            delay: delay + 100
          });
        } else {
          resolve(extractorToUse(body));
        }

      });
    }, delay);

  });
  return promise;
}



function scrapeFlyer(storeId) {

  // Use an absurdly high number of products to ensure we always get them all.
  const numOfProducts = '10000';
  const options = {
    url: `http://www.nofrills.ca/banners/publication/v1/en_CA/NOFR/current/${storeId}/items?start=0&rows=${numOfProducts}&tag=`,
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  };

  return getPromiseToGetThing(options, extractor.extractFlyer).then(flyer => {
    flyer.id = 1;
    flyer.store_id = storeId;

    return flyer;
  });
}

module.exports = {scrapeFlyer, scrapeStores};
