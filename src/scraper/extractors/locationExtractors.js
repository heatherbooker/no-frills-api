const cheerio = require('cheerio');


function extractProvinces(data) {
  const provinceData = JSON.parse(data).provincePrompt;
  const provinces = provinceData.map(province => province.label);
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
      const cityObject = {province: match[1], city: match[2]};
      cities.push(cityObject);
    }
  });
  return cities;
}

module.exports = {extractCities, extractProvinces};
