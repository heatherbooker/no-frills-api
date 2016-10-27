const request = require('request');
const cheerio = require('cheerio');
const storeExtractor = require('./src/scraper/extractors/storeExtractor.js');

const nofrillsData = {};

function extractProvinces(data, nofrillsData) {
  const provinces = JSON.parse(data).provincePrompt;
  const provinceCodes = provinces.map(province => ({code: province.label}));
  nofrillsData.provinces = provinceCodes;

  return nofrillsData;
}

function extractCities(data, nofrillsData) {
  const cities = [];
  let currentProvince;
  const $ = cheerio.load(data);

  $('a').each(function() {
    const link = $(this).attr('href');

    // The city name is after the two char province, in (.+?) .
    const match = link.match(/store-list-page\.([A-Z]{2})\.(.+?)\.html/);

    if (match) {
      currentProvince = match[1];
      const cityObject = {
        nameForEndpoint: match[2],
        name: match[2].replace(/%20/g, ' ').trim()
      };
      cities.push(cityObject);
    }
  });

  nofrillsData.provinces.forEach(province => {
    if (province.code === currentProvince) {
      province.cities = cities;
    }
  });

  return nofrillsData;
}

function extractStores(data, nofrillsData) {
  const stores = storeExtractor(data);
  // Finds the appropraite city in nofrillsData to add stores to.
  const provinceCode = stores[0].address.province;
  const cityName = stores[0].address.city;
  const province = nofrillsData.provinces.find(prov => prov.code === provinceCode);
  const city = province.cities.find(city => city.name === cityName);
  city.stores = stores;

  return nofrillsData;
}

const firstEndpoint = `http://www.nofrills.ca/banners/global/v1/en_CA/nofrills`;

makeDelayedRequest(firstEndpoint)
  // Gets list of provinces.
  .then(data => {
    return extractProvinces(data, nofrillsData);
  })
  // Gets list of cities in each province.
  .then(nofrillsData => {
    const promises = nofrillsData.provinces.map(province => {
      const cityEndpoint = `http://www.nofrills.ca/en_CA/store-list-page.${province.code}.html`;
      return makeDelayedRequest(cityEndpoint).then(data => {
        return extractCities(data, nofrillsData);
      });
    });
    return Promise.all(promises);
  })
  // Removes provinces which have no cities (& therefore no stores).
  .then(() => {
    nofrillsData.provinces = nofrillsData.provinces.filter(province => province.cities);
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

        const promise = makeDelayedRequest(storesEndpoint, delay).then(data => {
          extractStores(data, nofrillsData);
        });

        promises.push(promise);
      });
    });
    return Promise.all(promises);
  })
  // Prints final nofrillsData object.
  .then(data => {
    console.log(JSON.stringify(nofrillsData.provinces[0].cities, null, 2), '\nthe end!');
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


