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
    waitFor(function() {
      return page.evaluate(function() {
        return document.querySelector('.card-grid-layout div.card');
      });
    }, function() {
      page.evaluate(function() {
        var products = [];
        var cards = document.querySelectorAll('.card-grid-layout div.card');

        for (var i = 0; i < 9; i++) {
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
