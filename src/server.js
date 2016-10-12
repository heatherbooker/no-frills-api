const express = require('express');
const server = express();
const scraper = require('./scraper');
const nofrills = require('./nofrills.js');


server.get('/', (req, res) => {
  

  // nofrills.getStoreById('27').then(result => {
  //   res.send(result);
  // });
  // nofrills.getAllStoresFromCity('Hagersville', 'ON').then(result => {
  //   res.send(result);
  // });
  // nofrills.getAllStoresFromProvince('ON').then(result => {
  //   res.send(result);
  // });
  nofrills.getAllStores().then(result => {
    res.send(result);
    console.log(req.headers);
  }).catch(err => {
    console.warn(err);
    res.send('error:', err);
  });

});

server.listen(8080, () => {
  console.log(`Go to http://localhost:8080`);
});

module.exports = server;
