/**
 * @file Makes http request to nofrills, writes formatted data to another file.
 */
var fs = require('fs');
var request = require('request');
var extract = require('./extractors.js');


// If we don't know how many products there are, there's probably at least 1.
function getOptions(numOfProducts = 1) {
  return {
    url: `http://www.nofrills.ca/banners/publication/v1/en_CA/NOFR/current/784/items?start=0&rows=${numOfProducts}&tag=`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Connection': 'keep-alive'
    }
  };
}

function scrape() {

  // fs.write won't work unless 'data' dir exists.
  fs.stat('src/data', function(err, stats) {
    if (err) {
      fs.mkdir('src/data');
    }
  });

  var filePath = 'src/data/no_frills_products.json';

  return new Promise(function(resolve, reject) {

    // First we need to check how many products there are for this flyer.
    request(getOptions(), function(err, response, body) {

      if (!err && response.statusCode === 200) {
        var numOfProducts = JSON.parse(body).flyerResponse.numFound;

        // Then we can fetch that number of products.
        request(getOptions(numOfProducts), function(err, response, body) {

          if (!err && response.statusCode === 200) {
            var productList = JSON.parse(body).flyerResponse.docs;
            var products = extract.products(productList);
            resolve(products);

          } else {
            reject(`Secondary request to nofrills endpoint failed; ${err}`);
          }
        });

      } else {
        reject('Primary request to nofrills endpoint failed; ' + err);
      }

    });
  })
  .then(function(products) {

    var fileContents = JSON.stringify({products}, null, 2) + '\n';
    fs.writeFile(filePath, fileContents);

    return filePath;
  });
}

module.exports = {
  scrape
};
