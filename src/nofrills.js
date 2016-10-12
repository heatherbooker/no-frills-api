/**
 * @file These functions will be exposed to the user.
 */
const request = require('request');
const locations = require('./scraper/locationScraper.js');
const scrape = require('./scraper');
const extract = require('./scraper/extractors');


function getStoreById(id) {
  return scrape.store(id);
}

function getAllStoresFromCity(city, province, delay = 1) {

  const endpoint = `http://www.nofrills.ca/banners/store/v1/listing/nofrills?lang=en_CA&banner=6&proximity=75&city=${city}&province=${province}`;
  const promise = new Promise((resolve, reject) => {

    setTimeout(function(delay) {
      request(endpoint, (error, response, body) => {
        if (error) {
          return reject(`Request to nofrills endpoint to get all stores from city ${city} failed; ${error}`);
        }

        try {
          const stores = JSON.parse(body);
          resolve(stores.map(store => extract.store(store)));
        } catch (err) {
          throw new Error(`Error parsing stores from ${city}:`, err);
        }

      });
    }, delay, delay);

  });
  return promise;
}

function getAllStoresFromProvince(province) {

  return locations.getCities(province).then(cities => {

    // Ontario has a lot of cities and needs to go last and have
    // more time to prevent overloading the nofrills server.
    var delay = province === 'ON' ? 5000 : 1;
    var cityPromises = cities.map(city => {
      delay += province === 'ON' ? 400 : 150;
      return getAllStoresFromCity(city.city, province, delay);
    });

    return Promise.all(cityPromises).then(storesByCity => {
      var stores = [];
      storesByCity.forEach(city => {
        city.forEach(store => {
          stores.push(store);
        });
      });
      return stores;
    });
  });
}

function getAllStores() {

  return locations.getProvinces().then(provinces => {
    const promises = provinces.map(province => {
      return getAllStoresFromProvince(province);
    });

    return Promise.all(promises).then(storesByProvince => {
      var allStores = [];
      storesByProvince.forEach(prov => {
        prov.forEach(store => {
          allStores.push(store);
        });
      });
      return allStores;
    });
  });

}

function getFlyerByStoreId(storeId) {
  const flyer = scrape.flyer(storeId);
  return extract.flyer(flyer);
}

function getAllFlyersFromCity(city, province) {
  return getAllStoresFromCity(city, province).then(stores => {
    return stores.map(store => getFlyerByStoreId(store.storeNumber));
  });
}

function getAllFlyersFromProvince(province) {
  return locations.getCities(province).then(cities => {
    const promises = cities.map(city => {
      return getAllFlyersFromCity(city, province);
    });
    return Promise.all(promises).then(flyers => {
      return flyers.reduce((prev, curr) => prev.concat(curr));
    });
  });
}

function getAllFlyers() {
  return locations.getProvinces().then(provinces => {
    const promises = provinces.map(province => {
      return getAllFlyersFromProvince(province);
    });

    return Promise.all(promises).then(flyers => {
      flyers.reduce((prev, curr) => prev.concat(curr));
    });
  });
}

module.exports = {
  getStoreById,
  getAllStoresFromCity,
  getAllStoresFromProvince,
  getAllStores,
  getFlyerByStoreId,
  getAllFlyersFromCity,
  getAllFlyersFromProvince,
  getAllFlyers
};
