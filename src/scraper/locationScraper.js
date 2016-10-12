const request = require('request');
const cheerio = require('cheerio');


function getProvinces() {

  const endpoint = 'http://www.nofrills.ca/banners/global/v1/en_CA/nofrills';
  const promise = new Promise((resolve, reject) => {

    request(endpoint, (error, response, body) => {
      if (error) {
        return reject(`Request to nofrills endpoint to get list of
                       provinces failed; ${error}`);
      }

      const provinceData = JSON.parse(body).provincePrompt;
      const provinceCodes = provinceData.map(province => province.label);
      resolve(provinceCodes);
    });
  });
  return promise;
}


function getCities(province) {

  const endpoint = `http://www.nofrills.ca/en_CA/store-list-page.${province}.html`;
  const promise = new Promise((resolve, reject) => {
    
    request(endpoint, (error, response, body) => {
      if (error) {
        return reject(`Request to nofrills endpoint to get list of
                       cities for ${province} failed; ${error}`);
      }

      const cities = [];
      const $ = cheerio.load(body);

      $('a').each(function() {
        const link = $(this).attr('href');

        // The city name is after the two char province, in (.+?) .
        const match = link.match(/store-list-page\.[A-Z]{2}\.(.+?)\.html/);
        if (match) {
          const cityObject = {province, city: match[1]};
          cities.push(cityObject);
        }
      });

      resolve(cities);
    });
  });

  return promise;
}

module.exports = {getProvinces, getCities};
