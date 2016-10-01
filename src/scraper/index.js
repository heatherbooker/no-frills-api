/**
 * @file Makes http request to nofrills, writes formatted data to another file.
 */
const request = require('request');
const extract = require('./extractors.js');

const storeNum = '784';
// Use an absurdly high number of products to ensure we always get them all.
const numOfProducts = '10000';
const options = {
  url: `http://www.nofrills.ca/banners/publication/v1/en_CA/NOFR/current/${storeNum}/items?start=0&rows=${numOfProducts}&tag=`,
  method: 'POST',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
};

function scrape() {

  return new Promise((resolve, reject) => {

    // First we need to check how many products there are for this flyer.
    request(options, (err, response, body) => {

      if (err) {
        return reject('Request to nofrills endpoint failed; ' + err);
      }

      const productList = JSON.parse(body).flyerResponse.docs;
      const products = extract.products(productList);
      resolve(products);

    });
  });
}

module.exports = {scrape};
