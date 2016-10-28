const extractor = require('./src/scraper/extractors/index.js');
const fs = require('fs');


const nofrillsData = {flyers: []};


let rawData;

new Promise((resolve, reject) => {
  fs.readFile('data/rawData.json', (err, data) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    rawData = JSON.parse(data);
    resolve(rawData.provinces);
  });
})
  // Gets list of provinces.
  .then(data => {
    return extractor.extractProvinces(data, nofrillsData);
  })
  // Gets list of cities in each province.
  .then(nofrillsData => {
    const promises = nofrillsData.provinces.map(province => {
      const data = rawData.cities.pop();
      return Promise.resolve(extractor.extractCities(data, nofrillsData));
    });
    return Promise.all(promises);
  })
  // Removes provinces which have no cities (& therefore no stores).
  .then(() => {
    nofrillsData.provinces = nofrillsData.provinces.filter(p => p.cities);
    return nofrillsData;
  })
  // Gets stores for each city.
  .then(nofrillsData => {
    const promises = [];
    nofrillsData.provinces.forEach(province => {
      province.cities.forEach(city => {

        const promise = new Promise((resolve, reject) => {
          const data = rawData.stores.pop();
          extractor.extractStores(data, nofrillsData);
          resolve();
        });

        promises.push(promise);
      });
    });
    return Promise.all(promises);
  })
  // Removes cities which have no stores.
  .then(() => {
    nofrillsData.provinces.forEach(prov => {
      prov.cities = prov.cities.filter(c => c.stores);
    });
  })
  // Gets current flyer for each store.
  .then(() => {
    const promises = [];
    nofrillsData.provinces.forEach(province => {
      province.cities.forEach(city => {
        city.stores.forEach(store => {

          const promise = new Promise((resolve, reject) => {
            extractor.extractFlyer(rawData.flyers.pop(), nofrillsData);
            resolve();
          });

          promises.push(promise);
        });
      });
    });
    return Promise.all(promises);
  })
  // Prints final nofrillsData object.
  .then(data => {
    console.log(JSON.stringify(nofrillsData.provinces[0].cities, null, 2),
      '\nthe end!');
  })
  .catch(reason => {
    console.log('final catch caught something good :(', reason);
  });
