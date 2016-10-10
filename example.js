var request = require('request');
var cheerio = require('cheerio');


function getProvinces() {

  var endpoint = 'http://www.nofrills.ca/banners/global/v1/en_CA/nofrills';
  var promise = new Promise((resolve, reject) => {

    request(endpoint, (error, response, body) => {
      if (error) {
        return reject(error);
      }

      var provinceData = JSON.parse(body).provincePrompt;
      var provinceCodes = provinceData.map(province => province.label);
      resolve(provinceCodes);
    });
  });
  return promise;
}


function getCities(province) {

  var endpoint = `http://www.nofrills.ca/en_CA/store-list-page.${province}.html`;
  var promise = new Promise((resolve, reject) => {
    
    request(endpoint, (error, response, body) => {
      if (error) {
        return reject(error);
      }

      var cities = [];
      const $ = cheerio.load(body);

      $('a').each(function() {
        var link = $(this).attr('href');

        // The city name is after the two char province, in (.+?) .
        var match = link.match(/store-list-page\.[A-Z]{2}\.(.+?)\.html/);
        if (match) {
          var cityObject = {province, city: match[1]};
          cities.push(cityObject);
        }
      });

      resolve(cities);
    });
  });

  return promise;
}


function getStore(city, province) {

  // console.log('get store code for city: "' + city + '" in province "' + province + '"');

  var endpoint = `http://www.nofrills.ca/banners/store/v1/listing/nofrills?lang=en_CA&city=${city}&province=${province}`;
  var promise = new Promise((resolve, reject) => {

    request(endpoint, (error, response, body) => {
      if (error) {
        return reject(error);
      }
      resolve(JSON.parse(body));
    });
  });
  return promise;
}


function main() {

  getProvinces()

    .then(provinces => {

      var storePromises = provinces.map(province => {
        return getCities(province).then(cities => {
          console.log(cities[0]);
          return cities.map(city => {
            return getStore(city, province);
          });
        });
      });

      return Promise.all(storePromises).then(storeLists => {
        // console.log(storeLists[0]);
        var mop = storeLists.reduce((prev, current) => {
          return prev.concat(current);
        });
        // console.log(typeof mop, mop[0], mop);
      });
    // })

    // .then(stores => {
    //   console.log(typeof stores, 'should be array', stores[0]);
    //   stores.forEach(store => {
    //     console.log(JSON.parse(store).storeNum);
    //   });
    });
}


// get all stores
// get stores for <city> in <province>
// get stores for <province>
// get store

module.exports = {getProvinces, getCities, getStore};
