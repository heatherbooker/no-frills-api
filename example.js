var request = require('request');
var fs = require('fs');
var spawn = require('child_process').spawn;


function getProvinces() {

  var endpoint = 'http://www.nofrills.ca/banners/global/v1/en_CA/nofrills';
  var promise = new Promise((resolve, reject) => {

    request(endpoint, (error, response, body) => {
      if (error) {
        reject(error);
      }

      var provinceData = JSON.parse(body).provincePrompt;
      var provinceCodes = provinceData.map(province => province.label);
      resolve(provinceCodes);
    });
  });
  return promise;
}


function scrapeCities(province, fileStream) {

  if (province !== 'MB') {

  var endpoint = `http://www.nofrills.ca/en_CA/store-list-page.${province}.html`;
  var promise = new Promise((resolve, reject) => {
    
    request(endpoint)
      .on('response', response => {
        console.log('scraping ' + province);
        resolve();
      })
      .pipe(fileStream);
  });

  return promise;
}
}


function extractCities() {

  var promise = new Promise((resolve, reject) => {

    const python = spawn('python', ['example.py']);

    python.stdout.on('data', (data) => {
      console.log('got smthg', data.toString());
      const cityLists = JSON.parse(data.toString());

      Object.keys(cityLists).forEach(province => {
        cityLists[province].forEach(city => {
          getStore(city, province);
        });
      });
    });

    python.stderr.on('data', (err) => {
      console.log(`stderr while running python child_process: ${err}`);
    });

    python.on('close', () => {
      resolve();
    });
  
  });
  return promise;
}


function getStore(city, province) {

  console.log('get store code for city: "' + city + '"');

  var endpoint = `http://www.nofrills.ca/banners/store/v1/listing/nofrills?lang=en_CA&city=${city}&province=${province}`;
  var promise = new Promise((resolve, reject) => {

    request(endpoint, (error, response, body) => {
      if (error) {
        reject(error);
      }

      resolve(body);
    });
  });
  return promise;
}

function main() {

  getProvinces()

    .then(provinces => {

      var fileName = 'example.html';
      var htmlSoupStream = fs.createWriteStream(fileName, {autoClose: false});

      return new Promise((resolve, reject) => {

        htmlSoupStream.on('open', () => {

          var cityScraperPromises = provinces.map(province => {
            return scrapeCities(province, htmlSoupStream);
          });

          return Promise.all(cityScraperPromises).then(() => {
            htmlSoupStream.end();

            resolve(fileName);
          });
        });
      });
    })

    .then(fileName => {
      return extractCities(fileName);
    })

    .then(() => {
      spawn('rm', ['example.html']);
    });
}

main();
