/**
 * @file Opens NoFrills website and scrapes data in a headless browser using phantomjs, then writes to output file.
 */
var page = require('webpage').create();
var waitFor = require('./waitFor.js');
var fs = require('fs');
var productExtractor = require('./extractors/productExtractor.js');

// The scraped data will be written to this file.
var path = 'src/data/no_frills_products.json';


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
      for (var i = 0; i < products.length; i++) {
        var data = productExtractor.extract(products[i]);
        if (data) {
          products[i] = data;
        } else {
          products.splice(i, 1);
        }
      }
      fs.write(path, JSON.stringify({products: products}, null, 2), 'w');
      phantom.exit();
    }, 5000); // 5000 is the number of milliseconds that waitFor will run before timing out.
  } else {
    console.log('errorOpeningPage');
    phantom.exit();
  }
});
