/**
 * @file Makes http requests to nofrills for a single flyer or store.
 */
const request = require('request');
const extract = require('./extractors');


function scrapeFlyer(storeId) {

  // Use an absurdly high number of products to ensure we always get them all.
  const numOfProducts = '10000';
  const options = {
    url: `http://www.nofrills.ca/banners/publication/v1/en_CA/NOFR/current/${storeId}/items?start=0&rows=${numOfProducts}&tag=`,
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  };

  return new Promise((resolve, reject) => {

    request(options, (err, response, body) => {

      if (err) {
        return reject('Request to nofrills flyer endpoint failed; ' + err);
      }

      const flyer = extract.flyer(JSON.parse(body));
      flyer.id = 1;
      flyer.store_id = storeId;
      resolve(flyer);

    });
  });
}

function scrapeStore(storeId) {

  const endpoint = `http://www.nofrills.ca/banners/store/v1/details/nofrills?lang=en_CA&storeId=${storeId}`;

  return new Promise((resolve, reject) => {

    request(endpoint, (err, response, body) => {

      if (err) {
        return reject('Request to nofrills store endpoint failed; ' + err);
      } else if (body === '') {
        return reject(`Request to nofrills store ${storeId} endpoint failed; Unable to find a store with that ID.`);
      }

      const storeInfo = JSON.parse(body);
      const store = extract.store(storeInfo);
      resolve(store);

    });
  });
}

module.exports = {store: scrapeStore, flyer: scrapeFlyer};
