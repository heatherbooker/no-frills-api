/**
 * @file Opens NoFrills website and scrapes data in a headless browser using phantomjs, then writes to output file.
 */
var page = require('webpage').create();
var waitFor = require('./waitFor.js');
var fs = require('fs');

// The scraped data will be written to this file.
var path = 'src/phantom/scrapedData.json';


page.open('http://www.nofrills.ca/en_CA/flyers.banner@NOFR.storenum@3410.week@current.html', function(status) {
  if (status === 'success') {
    // We need to wait for the products to be loaded before trying to get their data.
    waitFor(function() {
      return page.evaluate(function() {
        return document.querySelector('.card-grid-layout div.card');
      });
    }, function() {
      // Actual scraping happens in this page.evaluate.
      var products = page.evaluate(function() {
        var products = [];
        var cards = document.querySelectorAll('.card-grid-layout div.card');

        for (var i = 0; i < cards.length; i++) {
          products.push(cards[i].textContent);
        }
        return products;
      });
      fs.write(path, JSON.stringify({products: products}, null, 2), 'w');
      phantom.exit();
    }, 5000); // 5000 is the number of milliseconds that waitFor will run before timing out.
  } else {
    console.log('errorOpeningPage');
    phantom.exit();
  }
});
