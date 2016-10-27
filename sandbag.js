const request = require('request');
const extractor = require('./src/scraper/extractors/index.js');
const fs = require('fs');

// const nofrillsData = {flyers: []};


function extractStores(data, nofrillsData) {
  const stores = extractor.extractStores(data);
  // Finds the appropraite city in nofrillsData to add stores to.
  const provinceCode = stores[0].address.province;
  const cityName = stores[0].address.city;
  const province = nofrillsData.provinces.find(prov => prov.code === provinceCode);
  const city = province.cities.find(city => city.name === cityName);
  city.stores = stores;

  return nofrillsData;
}

function extractFlyer(data, nofrillsData) {
  const flyer = extractor.extractFlyer(data);
  if (flyer) {
    // Ids are strings for consistency with other data in nofrills object.
    // The id of a flyer is one more than the id of the latest flyer.
    flyer.id = String(nofrillsData.flyers.length + 1);
    nofrillsData.flyers.push(flyer);
    // Finds the appropriate store in nofrillsData to add flyer ids to.
    const storeId = flyer.store_id;

    for (let i = 0; i < nofrillsData.provinces.length; i++) {
      const numOfCities = nofrillsData.provinces[i].cities.length;
      for (let j = 0; j < numOfCities; j++) {

        const stores = nofrillsData.provinces[i].cities[j].stores;
        const store = stores.find(s => s.id === storeId);
        if (store) {
          store.flyer_ids.push(flyer.id);
          return nofrillsData;
        }
      }
    }
  }
}

const firstEndpoint = `http://www.nofrills.ca/banners/global/v1/en_CA/nofrills`;

function getFlyerEndpoint(storeId) {
  // Use an absurdly high number of products to ensure we always get them all.
  const numOfProducts = '10000';
  return {
    url: `http://www.nofrills.ca/banners/publication/v1/en_CA/NOFR/current/${storeId}/items?start=0&rows=${numOfProducts}&tag=`,
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  };
}

// makeDelayedRequest(firstEndpoint)
//   // Gets list of provinces.
//   .then(data => {
//     console.log('got provinces');
//     return extractor.extractProvinces(data, nofrillsData);
//   })
//   // Gets list of cities in each province.
//   .then(nofrillsData => {
//     console.log('getting cities');
//     const promises = nofrillsData.provinces.map(province => {
//       const cityEndpoint = `http://www.nofrills.ca/en_CA/store-list-page.${province.code}.html`;
//       return makeDelayedRequest(cityEndpoint).then(data => {
//         return extractor.extractCities(data, nofrillsData);
//       });
//     });
//     return Promise.all(promises);
//   })
//   // Removes provinces which have no cities (& therefore no stores).
//   .then(() => {
//     console.log('got cities');
//     nofrillsData.provinces = nofrillsData.provinces.filter(province => province.cities);
//     console.log(nofrillsData);
//     return nofrillsData;
//   })
//   // Gets stores for each city.
//   .then(nofrillsData => {
//     console.log('getting stores');
//     const promises = [];
//     nofrillsData.provinces.forEach(province => {
//       // Adds a delay between requests so we don't overwhelm nofrills site.
//       let delay = 1;
//       province.cities.forEach(city => {
//         const storesEndpoint = `http://www.nofrills.ca/banners/store/v1/listing/nofrills?lang=en_CA&banner=6&proximity=75&city=${city.nameForEndpoint}&province=${province.code}`;
//         delay += 400;

//         const promise = makeDelayedRequest(storesEndpoint, delay).then(data => {
//           extractStores(data, nofrillsData);
//         });

//         promises.push(promise);
//       });
//     });
//     return Promise.all(promises);
//   })
  // // Removes cities which have no stores.
  // .then(() => {
  //   nofrillsData.provinces.forEach(prov => {
  //     prov.cities = prov.cities.filter(c => c.stores);
  //   });
  // })
//   .then(() => {
//     fs.writeFile('data/nofrillsData.json', JSON.stringify(nofrillsData));
//   })
let rawFlyers;
let nofrillsData;
new Promise((resolve, reject) => {
  fs.readFile('data/nofrillsData.json', (err, data) => {
    fs.readFile('data/rawFlyers.json', (err, flyers) => {
      rawFlyers = JSON.parse(flyers);
      resolve(data);
    })
  });
})
  .then(data => {
    nofrillsData = JSON.parse(data.toString());
    nofrillsData.provinces.forEach(prov => {
      prov.cities = prov.cities.filter(c => c.stores);
    });
    return nofrillsData;
  })
  // Gets current flyer for each store.
  .then(data => {
    nofrillsData = data;
    const promises = [];
    nofrillsData.provinces.forEach(province => {
      // Adds a delay between requests so we don't overwhelm nofrills site.
      let delay = 1;
      province.cities.forEach(city => {
        city.stores.forEach(store => {
          const flyerEndpoint = getFlyerEndpoint(store.id);
          delay += 400;

          // const promise = makeDelayedRequest(flyerEndpoint, delay).then(data => {
          //   extractFlyer(data, nofrillsData);
          // });
          const promise = new Promise((resolve, reject) => {
            extractFlyer(rawFlyers.pop(), nofrillsData);
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
    console.log(JSON.stringify(nofrillsData.provinces[0].cities, null, 2), '\nthe end!');
    // fs.writeFile('data/finalNoFrillsData.json', JSON.stringify(nofrillsData, null, 2));
  })
  .catch(reason => {
    console.log('final catch caught something good :(', reason);
  });



function makeDelayedRequest(endpoint, delay = 1) {

  const promise = new Promise((resolve, reject) => {

    setTimeout(() => {
      request(endpoint, (error, response, body) => {
        if (error) {
          return reject(`Request to ${endpoint} failed: ${error}`);
        }
        if (!body) {
          return makeDelayedRequest(endpoint, delay + 1000);
        }
        resolve(body);

      });
    }, delay);

  });
  return promise;
}


