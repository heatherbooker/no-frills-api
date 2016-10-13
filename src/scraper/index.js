/**
 * @file Makes http requests to nofrills to get store and flyer data.
 */
const request = require('request');
const extractor = require('./extractors');


function getPromiseToGetThing(options, extractorToUse, delay = 1) {

  const promise = new Promise((resolve, reject) => {

    setTimeout(function() {
      request(options, (error, response, body) => {
        if (error) {
          return reject(`Request to ${options} failed: ${error}`);
        }

        try {
          resolve(extractorToUse(body));

        } catch (err) {
          return reject(`HTTP response body: ${body}\nError extracting info
            from body of http response from ${options}; Body of http response
            found above; Error: ${err}`);
        }

      });
    }, delay);

  });
  return promise;
}


function getAllStores() {

  const provincesEndpoint = `http://www.nofrills.ca/banners/global/v1/en_CA/nofrills`;

  return getPromiseToGetThing(provincesEndpoint, extractor.extractProvinces)
    .then(provinces => {
      const promises = provinces.map(province => {
        const citiesEndpoint = `http://www.nofrills.ca/en_CA/store-list-page.${province}.html`;

        return getPromiseToGetThing(citiesEndpoint, extractor.extractCities)
          .then(cities => {
            return getAllStoresFromProvince(province, cities);
          });
      });

      return Promise.all(promises).then(storesByProvince => {

        var stores = [];
        storesByProvince.forEach(province => {
          province.forEach(store => {
            stores.push(store);
          });
        });

        return stores;
      });
    });
}


function getAllStoresFromProvince(province, cities) {

  // Ontario has a lot of cities and needs to go last and have
  // more time to prevent overloading the nofrills server.
  let delay = province === 'ON' ? 5000 : 1;
  const cityPromises = cities.map(city => {
    delay += province === 'ON' ? 400 : 150;

    return getAllStoresFromCity(city.city, province, delay);
  });

  return Promise.all(cityPromises).then(storesByCity => {
    console.log('got all stores for all cities in province', province);

    var stores = [];
    storesByCity.forEach(city => {
      city.forEach(store => {
        stores.push(store);
      });
    });

    return stores;
  })
  .catch(reason => {
    console.warn(reason);
  });
}


function getAllStoresFromCity(city, province, delay) {

  const endpoint = `http://www.nofrills.ca/banners/store/v1/listing/nofrills?lang=en_CA&banner=6&proximity=75&city=${city}&province=${province}`;
  return getPromiseToGetThing(endpoint, extractor.extractStores, delay);
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

module.exports = {scrapeFlyer, scrapeStores: getAllStores};
