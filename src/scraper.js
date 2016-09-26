/**
 * @file Manages the scraping and extracting of data from NoFrills website.
 */
const spawnSync = require('child_process').spawnSync;
const phantomBin = 'phantomjs';
const path = require('path');
const pathToScraper = path.join(__dirname, './phantom/phantomScraper.js');


function scrape() {
  console.log('Scraping...');
  // Synchronously runs phantomjs scraper in a node child process.
  const result = spawnSync(phantomBin, [pathToScraper], {encoding: 'utf8'});

  if (result.error) {
    if (result.error.path === phantomBin) {
      throw new Error('phantomjsNotFound');
    }
    throw result.error;
  } else if (result.stdout.trim() === 'errorOpeningPage') {
    throw new Error('errorOpeningPage');
  }
}

module.exports = {
  scrape
};
