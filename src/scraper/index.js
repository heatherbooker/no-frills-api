var fs = require('fs');
var request = require('request');
var extract = require('./extractors.js');


var headers = {
  'Origin': 'http://www.nofrills.ca',
  'Accept-Encoding': 'gzip, deflate, lzma',
  'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6',
  'User-Agent': `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36 OPR/39.0.2256.48`,
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'application/json',
  'Referer': `http://www.nofrills.ca/en_CA/flyers.banner@NOFR.storenum@784.week@current.html`,
  'X-Requested-With': 'XMLHttpRequest',
  'Connection': 'keep-alive',
  'Content-Length': '0',
  'Cookie': `JSESSIONID=0001VjSBD8ZOhtDgdDYldX_I9pW:-H88BM; storeIdCookie=292; storeNumCookie=784; storeProvienceCookie=ON; SessionPersistence-publish=CLIENTCONTEXT%3A%3DvisitorId%3D%2CvisitorId_xss%3D%7CPROFILEDATA%3A%3D%7C; cq5pr=CQ5_HER; NSC_qsdrif.mpcmbx.db_80=ffffffff0960541945525d5f4f58455e445a4a423660`
};

function getOptions(numOfProducts = 1) {
  return {
    url: `http://www.nofrills.ca/banners/publication/v1/en_CA/NOFR/current/784/items?start=0&rows=${numOfProducts}&tag=`,
    method: 'POST',
    headers: headers
  };
}

function scrape(callback) {
  fs.stat('src/data', function(err, stats) {
    if (err) {
      throw new Error('error while checking for directory "src/data": ' + err);
    }
    if (!stats) {
      fs.mkdir('src/data');
    }
  });
  var filePath = 'src/data/no_frills_products.json';
  request(getOptions(), function(err, response, body) {
    if (!err && response.statusCode === 200) {
      var numOfProducts = JSON.parse(body).flyerResponse.numFound;
      request(getOptions(numOfProducts), function(err, response, body) {

        if (!err && response.statusCode === 200) {
          var products = extract.products(JSON.parse(body).flyerResponse.docs);
          var fileContents = JSON.stringify({products}, null, 2);
          fs.writeFile(filePath, fileContents);
          callback();
        } else {
          throw new Error(`secondary request to nofrills endpoint failed: ${err}`);
        }
      });
    } else {
      throw new Error('primary request to nofrills endpoint failed: ' + err);
    }
  });
  return filePath;
}

module.exports = {
  scrape
};
