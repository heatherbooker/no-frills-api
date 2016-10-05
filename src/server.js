const express = require('express');
const server = express();
const scraper = require('./scraper');


server.get('/', (req, res) => {
  scraper.scrape()
    .then(data => {
      res.send('Scraping successful;<br /><br />store:<br /><br /><br />' +
                JSON.stringify(data.store, null, '<br />') +
                '<br /><br /><br />first product:<br /><br /><br />' +
                JSON.stringify(data.flyer[0], null, '<br />'));
    })
    .catch(error => {
      res.send('Error while attempting to scrape: \n', error);
    });
});

server.listen(8080, () => {
  console.log(`Go to http://localhost:8080`);
});

module.exports = server;
