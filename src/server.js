const express = require('express');
const server = express();
const NoFrills = require('./NoFrills.js');


const nofrills = new NoFrills();

server.get('/', (req, res) => {

  res.send(nofrills.getAllStores());

});

server.get('/flyers', (req, res) => {

  res.send(nofrills.getAllFlyers());

});

nofrills.init().then(() => {

  server.listen(8080, () => {
    console.log(`Go to http://localhost:8080/flyers`);
  });

});

module.exports = server;
