const cheerio = require('cheerio');
const storeExtractor = require('./storeExtractor.js');


function extractProvinces(data) {
  const provinceData = JSON.parse(data).provincePrompt;
  const provinces = provinceData.map(province => {

    return {
      endpoint: `http://www.nofrills.ca/en_CA/store-list-page.${province.label}.html`,
      extractor: extractCities
    };
  });
  return provinces;
}

function extractCities(cityHtml) {
  const cities = [];
  const $ = cheerio.load(cityHtml);

  $('a').each(function() {
    const link = $(this).attr('href');

    // The city name is after the two char province, in (.+?) .
    const match = link.match(/store-list-page\.([A-Z]{2})\.(.+?)\.html/);

    if (match) {
      const cityObject = {
        province: match[1],
        endpoint: `http://www.nofrills.ca/banners/store/v1/listing/nofrills?lang=en_CA&
        banner=6&proximity=75&city=${match[2]}&province=${match[1]}`,
        extractor: storeExtractor
      };
      cities.push(cityObject);
    }
  });
  return cities;
}

module.exports = {extractCities, extractProvinces};
