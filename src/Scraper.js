const spawn = require('child_process').spawnSync;
const phantomBin = 'phantomjs';
const path = require('path');
const pathToScraper = path.normalize('./phantom/phantomScraper.js');

function phantomResults(phantom) {
  if (phantom.error) {

    if (phantom.error.path === phantomBin) {
      return 'Error - are you sure you have phantomjs installed?';
    } else {
      return phantom.error;
    }

  } else {
    return phantom.stdout;
  }
}

function Scraper() {

  function scrape(extractors) {

    return new Promise((resolve, reject) => {

      var products = [];

      // Synchronously runs phantomjs web scraper in a node child process.
      const phantom = spawn(phantomBin, [pathToScraper], {encoding: 'utf8'});

      resolve(phantomResults(phantom));

    });

  }

  return {scrape: scrape};;
}

var scraper = new Scraper();

scraper.scrape().then(coolStuff => {console.log(coolStuff);});
