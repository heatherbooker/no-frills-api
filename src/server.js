const express = require('express');
const server = express();
const flyerRouter = require('./controllers/flyerController.js');
const storeRouter = require('./controllers/storeController.js');
const noFrills = require('./noFrills.js');


server.use('/api/v0/flyers', flyerRouter);

server.use('/api/v0/stores', storeRouter);

server.use(express.static('static'));


noFrills.on('noFrills-initialized', () => {

  server.listen(8080, () => {
    console.log(`Go to http://localhost:8080/`);
  });

});

module.exports = server;
