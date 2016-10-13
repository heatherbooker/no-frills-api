const express = require('express');
const server = express();
const NoFrills = require('./nofrills.js');

const nofrills = new NoFrills();

server.get('/', (req, res) => {

  const stores = nofrills.getAllStores();
  res.send(stores);

});

server.listen(8080, () => {
  console.log(`Go to http://localhost:8080`);
});

module.exports = server;
