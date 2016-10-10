const express = require('express');
const server = express();
const scraper = require('./scraper');
const gets = require('../example.js');


server.get('/', (req, res) => {


  gets.getProvinces()
    .then(provinces => {
      console.log('got proinvces');
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
      console.log('got cities');
      var promises = cities.map(city => {
        return gets.getStore(city.city, city.province);
      });
      Promise.all(promises).then((stores) => {
        var storeNums = stores.map(store => store.storeName);
        res.send(storeNums);
        console.log('done! check localhost:8080');
      })
    });


});

server.listen(8080, () => {
  console.log(`Go to http://localhost:8080`);
});

module.exports = server;
