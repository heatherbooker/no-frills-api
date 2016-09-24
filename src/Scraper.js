const spawnSync = require('child_process').spawnSync;
const phantomBin = 'phantomjs';
const path = require('path');
const pathToScraper = path.join(__dirname, './phantom/phantomScraper.js');

function phantomResults(phantom) {
  if (phantom.error) {
    if (phantom.error.path === phantomBin) {
      return 'Error - are you sure you have phantomjs installed?';
    }
    return phantom.error;
  }
  return phantom.stdout;
}

function Scraper() {
  function scrape(extractors) {
    // Synchronously runs phantomjs scraper in a node child process.
    const phantom = spawnSync(phantomBin, [pathToScraper], {encoding: 'utf8'});

    return phantomResults(phantom);
  }
  return {scrape: scrape};
}

var scraper = new Scraper();
var data = scraper.scrape();
console.log('after scraping:', data);
