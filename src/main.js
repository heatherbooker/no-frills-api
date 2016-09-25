var scraper = require('./Scraper.js');

try {
  var data = scraper.scrape();
  console.log('scraping completed; data: ', data);
} catch (error) {
  if (error.message === 'phantomjsNotFound') {
    console.log('Error - are you sure you have phantomjs installed?');
    process.exit(5);
  } else {
    console.log('Error running scraper: ', error);
  }
}
