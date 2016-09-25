const spawnSync = require('child_process').spawnSync;
const phantomBin = 'phantomjs';
const path = require('path');
const pathToScraper = path.join(__dirname, './phantom/phantomScraper.js');


function scrape(extractors) {
  // Synchronously runs phantomjs scraper in a node child process.
  const result = spawnSync(phantomBin, [pathToScraper], {encoding: 'utf8'});

  if (result.error) {
    if (result.error.path === phantomBin) {
      throw 'phantomjsError';
    }
    throw result.error;
  }
  return result.stdout;
}

module.exports = {
  scrape
};
