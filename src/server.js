const express = require('express');
const server = express();
const scraper = require('./scraper');
const gets = require('../example.js');


server.get('/', (req, res) => {
  // scraper.scrape()
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(error => {
  //     res.send('Error while attempting to scrape: \n', error);
  //   });


gets.getProvinces()
  .then(provinces => {
    var promises = provinces.map(province => {
      return gets.getCities(province);
    });
    return Promise.all(promises).then(cityLists => {
      var cities = cityLists.filter(cityList => cityList.length > 0).reduce((prev, curr) => {
        return prev.concat(curr);
      });
      return cities;
    });
  })
  .then(cities => {
    var promises = cities.map(city => {
      return gets.getStore(city.city, city.province);
    });
    Promise.all(promises).then((stores) => {
      console.log('done');
      console.log('done done');
      res.send(stores);
      console.log('done done done');
    })
  });


});

server.listen(8080, () => {
  console.log(`Go to http://localhost:8080`);
});

module.exports = server;
