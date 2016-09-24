const spawnSync = require('child_process').spawnSync;
const phantomBin = 'phantomjs';
const path = require('path');
const pathToScraper = path.join(__dirname, './phantom/phantomScraper.js');

function getPhantomResults(phantom) {
  if (phantom.error) {
    if (phantom.error.path === phantomBin) {
      return 'Error - are you sure you have phantomjs installed?';
    }
    return phantom.error;
  }
  return phantom.stdout;
}

function scrape(extractors) {
  // Synchronously runs phantomjs scraper in a node child process.
  const phantom = spawnSync(phantomBin, [pathToScraper], {encoding: 'utf8'});

  return getPhantomResults(phantom);
}

module.exports = {
  scrape
}
