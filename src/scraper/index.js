/**
 * @file Makes http request to nofrills, writes formatted data to another file.
 */
const request = require('request');
const extract = require('./extractors');


function scrapeFlyer() {

  const storeNum = '784';
  // Use an absurdly high number of products to ensure we always get them all.
  const numOfProducts = '10000';
  const options = {
    url: `http://www.nofrills.ca/banners/publication/v1/en_CA/NOFR/current/${storeNum}/items?start=0&rows=${numOfProducts}&tag=`,
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  };

  return new Promise((resolve, reject) => {

    request(options, (err, response, body) => {

      if (err) {
        return reject('Request to nofrills flyer endpoint failed; ' + err);
      }

      const productList = JSON.parse(body).flyerResponse.docs;
      const products = extract.products(productList);
      resolve(products);

    });
  });
}

function scrapeStore() {

  const storeId = '100';
  const options = {url: `http://www.nofrills.ca/banners/store/v1/details/nofrills?lang=en_CA&storeId=${storeId}`};

  return new Promise((resolve, reject) => {

    request(options, (err, response, body) => {

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

module.exports = {scrapeFlyer, scrapeStore};
