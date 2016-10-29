const express = require('express');
const server = express();
const flyerRouter = require('./controllers/flyerController.js');
const noFrills = require('./NoFrills.js');


server.use('/api/v0/flyers', flyerRouter);


noFrills.on('noFrills-initialized', () => {

  server.listen(8080, () => {
    console.log(`Go to http://localhost:8080/api/v0/flyers/1`);
  });

});

module.exports = server;
