const express = require('express');
const server = express();
const NoFrills = require('./NoFrills.js');


const nofrills = new NoFrills();


server.get('/stores', (req, res) => {

  res.send(nofrills.getAllStores());

});

server.get('/stores/:store_id', (req, res) => {

  res.send(nofrills.getStoreById(req.params.store_id));

});

server.get('/stores/:store_id/flyers', (req, res) => {

  res.send(nofrills.getFlyersForStore(req.params.store_id));

});

server.get('/flyers', (req, res) => {

  res.send(nofrills.getAllFlyers());

});

server.get('/flyers/:flyer_id', (req, res) => {

  res.send(nofrills.getFlyerById(req.params.flyer_id));

});


nofrills.init().then(() => {

  server.listen(8080, () => {
    console.log(`Go to http://localhost:8080`);
  });

});

module.exports = server;
