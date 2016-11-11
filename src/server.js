const express = require('express');
const server = express();
const flyerRouter = require('./controllers/flyerController.js');
const storeRouter = require('./controllers/storeController.js');
const noFrills = require('./noFrills.js');


server.use('/api/v0/flyers', flyerRouter);

server.use('/api/v0/stores', storeRouter);

server.use(express.static('static'));


noFrills.on('noFrills-initialized', () => {

  const port = process.env.PORT || 8080;

  server.listen(port, () => {
    console.log(`If running locally, go to http://localhost:8080`);
  });

});

module.exports = server;
