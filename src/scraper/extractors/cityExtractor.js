const cheerio = require('cheerio');


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

module.exports = extractCities;
