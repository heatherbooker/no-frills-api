/**
 * @file Opens NoFrills website and scrapes data in a headless browser using phantomjs.
 */

var page = require('webpage').create();
var waitFor = require('./waitFor.js');

page.onConsoleMessage = function(message) {
  var messages = Array.prototype.slice.call(arguments);
  messages.forEach(function(message) {
    console.log(message);
  });
};

console.log('beginning scraping now...');

page.open('http://www.nofrills.ca/en_CA/flyers.banner@NOFR.storenum@3410.week@current.html', function(status) {
  if (status === 'success') {
    // We need to wait for the products to be loaded before trying to get their data.
    waitFor(function() {
      return page.evaluate(function() {
        return document.querySelector('.card-grid-layout div.card');
      });
    }, function() {
      // Actual scraping happens in this page.evaluate.
      page.evaluate(function() {
        var products = [];
        var cards = document.querySelectorAll('.card-grid-layout div.card');

        for (var i = 0; i < cards.length; i++) {
          products.push(cards[i].textContent);
          console.log(i + 'th card: ' + cards[i].textContent);
        }
      });
      phantom.exit();
    });
  } else {
    console.log('error opening webpage:', status);
  }
});
