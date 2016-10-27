const request = require('request');
const extractor = require('./extractors/index.js');


function scrape() {

  const nofrillsData = {flyers: []};

  const provincesEndpoint = `http://www.nofrills.ca/banners/global/v1/en_CA/nofrills`;
  return makeDelayedRequest(provincesEndpoint)

    // Gets list of provinces.
    .then(data => {
      return extractor.extractProvinces(data, nofrillsData);
    })

    // Gets list of cities in each province.
    .then(nofrillsData => {
      const promises = nofrillsData.provinces.map(province => {
        const cityEndpoint = `http://www.nofrills.ca/en_CA/store-list-page.${province.code}.html`;
        return makeDelayedRequest(cityEndpoint).then(data => {
          extractor.extractCities(data, nofrillsData);
        });
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
        // Adds a delay between requests so we don't overwhelm nofrills site.
        let delay = 1;
        province.cities.forEach(city => {
          const storesEndpoint = `http://www.nofrills.ca/banners/store/v1/listing/nofrills?lang=en_CA&banner=6&proximity=75&city=${city.nameForEndpoint}&province=${province.code}`;
          delay += 400;

          const promise = makeDelayedRequest(storesEndpoint, delay)
            .then(data => {
              extractor.extractStores(data, nofrillsData);
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
        // Adds a delay between requests so we don't overwhelm nofrills site.
        let delay = 1;
        province.cities.forEach(city => {
          city.stores.forEach(store => {
            const flyerEndpoint = getFlyerEndpoint(store.id);
            delay += 400;

            const promise = makeDelayedRequest(flyerEndpoint, delay)
              .then(data => {
                extractor.extractFlyer(data, nofrillsData);
              });

            promises.push(promise);
          });
        });
      });
      return Promise.all(promises);
    })

    .then(() => {
      return nofrillsData;
    })

    .catch(reason => {
      console.log(`Oh crap, the catch statement in scraper/index.js
        caught something :(`, reason);
    });
}


function getFlyerEndpoint(storeId) {
  // Use an absurdly high number of products to ensure we always get them all.
  const numOfProducts = '10000';
  return {
    url: `http://www.nofrills.ca/banners/publication/v1/en_CA/NOFR/current/${storeId}/items?start=0&rows=${numOfProducts}&tag=`,
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  };
}


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

module.exports = {scrape};
