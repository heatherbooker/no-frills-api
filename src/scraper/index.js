/**
 * @file Makes http requests to nofrills to get store and flyer data.
 */
const request = require('request');
const extractor = require('./extractors');


function scrape(maxFlyerId) {

  // Start by just getting the list of provinces.
  const firstExtraction = {
    identity: 'provinces',
    endpoint: `http://www.nofrills.ca/banners/global/v1/en_CA/nofrills`,
    extractor: extractor.extractProvinces
  };
  const extractions = [firstExtraction];
  const stores = [];
  const flyers = [];
  let delay = 0;
  let newMaxFlyerId = ++maxFlyerId;

  function runExtractions(extractions) {
    const promise = new Promise((resolve, reject) => {
      while (extractions.length > 0) {

        const extraction = extractions[0];
        makeDelayedRequest(extraction.endpoint, delay)
          .then(response => {
            if (response === '') {
              delay += 2000;
              // Send it back to be tried again a little later.
              return [{
                endpoint: extraction.endpoint,
                extractor: extraction.extractor
              }];
            }
            return extraction.extractor(response);
          })
          .then(newExtractions => {
            newExtractions.forEach(newExtraction => {

              if (newExtraction.endpoint) {
                extractions.push(newExtraction);

              } else {
                const flyerId = newMaxFlyerId.toString();
                flyers.push({...newExtraction, id: flyerId});
                const storeToAddFlyer = stores.filter(store => {
                  return store.id === newExtraction.store_id;
                })[0];
                storeToAddFlyer.flyers.push(flyerId);
                newMaxFlyerId++;
              }
            });
            runExtractions(extractions);
          });

        if (extractions[0].store) {
          stores.push(extractions[0].store);
        }

        extractions.shift();
        delay += 5000;

        if (extractions.length === 0 && stores.length > 0) {
          resolve({stores, newMaxFlyerId, flyers});
        }
      }
    });
    return promise;
  }

  return runExtractions(extractions);
}


function makeDelayedRequest(options, delay = 1) {

  const promise = new Promise((resolve, reject) => {

    setTimeout(() => {
      request(options, (error, response, body) => {
        if (error) {
          return reject(`Request to ${options} failed: ${error}`);
        }

        resolve(body);

      });
    }, delay);

  });
  return promise;
}


module.exports = {scrape};
