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

// const cityEndpoint: `http://www.nofrills.ca/banners/store/v1/listing/nofrills?lang=en_CA&
//         banner=6&proximity=75&city=${match[2]}&province=${match[1]}`

const firstExtraction = {
  extractor: extractProvinces,
  endpoint: `http://www.nofrills.ca/banners/global/v1/en_CA/nofrills`
};
const extractions = [firstExtraction];

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
        name: match[2],
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
  try {
    nofrillsData.someStores = storeExtractor(data);
    console.log('extracting a store');
    return nofrillsData;
  } catch (e) {
    console.log('new error!' + e);
    return nofrillsData;
  }
}

makeDelayedRequest(extractions[0].endpoint)
  .then(data => {
    return extractProvinces(data, nofrillsData);
  })
  .then(nofrillsData => {
    const promises = nofrillsData.provinces.map(province => {
      const cityEndpoint = `http://www.nofrills.ca/en_CA/store-list-page.${province.code}.html`;
      return makeDelayedRequest(cityEndpoint).then(data => {
        return extractCities(data, nofrillsData);
      });
    });
    console.log('doing promises now');
    return Promise.all(promises);
  })
  .then(data => {
    console.log(JSON.stringify(nofrillsData), 'that was first set of data');
    return nofrillsData;
  })
  .then(nofrillsData => {
    const promises = nofrillsData.provinces.map(province => {
      console.log('working on province: ', province.code);
      if (province.cities) {
        const storesEndpoint = `http://www.nofrills.ca/banners/store/v1/listing/nofrills?lang=en_CA&banner=6&proximity=75&city=${province.cities[0].name}&province=${province.code}`;
        return makeDelayedRequest(storesEndpoint).then(data => {
          if (data) {
            console.log('got store data, about to extract it');
            const stores = extractStores(data, nofrillsData);
            return stores;
          } else {
            console.log('cam back empryt, trying again');
            return makeDelayedRequest(storesEndpoint, 1000).then(data => {
              return extractStores(data, nofrillsData);
            });
          }
        });
      } else {
        return Promise.resolve(true);
      }
    });
    console.log('now we\'re getting all the stores');
    return Promise.all(promises);
  })
  .then(data => {
    console.log(JSON.stringify(nofrillsData, null, 2), 'we got the stores');
  })
  .then(nothing => {
    console.log('the end.');
  });



function makeDelayedRequest(endpoint, delay = 1) {
  console.log('making request to ', endpoint);

  const promise = new Promise((resolve, reject) => {

    setTimeout(() => {
      request(endpoint, (error, response, body) => {
        if (error) {
          return reject(`Request to ${endpoint} failed: ${error}`);
        }
        console.log('got data', endpoint);
        resolve(body);

      });
    }, delay);

  });
  return promise;
}


