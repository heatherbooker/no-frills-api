const express = require('express');
const server = express();
const nofrills = require('./nofrills.js');


server.get('/', (req, res) => {

  nofrills.getAllStores()
    .then(stores => {
      res.send(stores);
      console.log('Done getting all stores; check localhost:8080 for listing');
    })
    .catch(err => {
      console.error(err);
      res.send('Error getting all stores:', err);
    });

});

server.listen(8080, () => {
  console.log(`Go to http://localhost:8080`);
});

module.exports = server;
