/**
 * @file This class exposes methods to get various groupings of stores & flyers.
 */
const EventEmitter = require('events');
const scraper = require('./scraper');
const fs = require('fs');
const winston = require('winston');


winston.add(winston.transports.File, {filename: './.logs.json'});

class NoFrills extends EventEmitter {

  constructor() {
    super();
    this.provinces = [];
    this.flyers = [];
  }

  init() {
    const fileName = './data/finalNoFrillsData.json';
    let fileDataExists = false;
    return new Promise((resolve, reject) => {
      // Use saved data if available.
      fs.readFile(fileName, (err, fileData) => {
        if (err) {
          winston.info(`there is currently no file on disk with nofrills data`);
          scraper.scrape().then(data => {
            winston.info('now finished all scraping activies');
            resolve(data);
          });
        } else {
          winston.info(`there is a file on disk with nofrills data, so there is no need to scrape`);
          fileDataExists = true;
          resolve(JSON.parse(fileData));
        }
      });
    })
      .then(data => {
        if (!fileDataExists) {
          // Save data for next time.
          if (!fs.existsSync('./data')) {
            fs.mkdirSync('./data');
          }
          fs.writeFileSync(fileName, JSON.stringify(data, null, 2) + '\n');
          winston.info(`a new file containing the fresh noFrills data has been created`);
        }
        return data;
      })
      .then(data => {
        this.provinces = data.provinces;
        this.flyers = data.flyers;
      })
      .catch(reason => {
        console.log(`Oh crap, the catch statement in noFrills.js caught something :(`, reason);
      });
  }

  getAllStores() {
    const allStores = [];
    this.provinces.forEach(prov => {
      prov.cities.forEach(city => {
        allStores.push(...city.stores);
      });
    });
    return allStores;
  }

  getStoreById(id) {
    for (let i = 0; i < this.provinces.length; i++) {
      let cities = this.provinces[i].cities;
      for (let j = 0; j < cities.length; j++) {
        let stores = cities[j].stores;
        for (let k = 0; k < stores.length; k++) {
          if (stores[k].id === id) {
            return stores[k];
          }
        }
      }
    }
  }

  getFlyersByStoreId(id) {
    const store = this.getStoreById(id);
    return store.flyer_ids.map(flyerId => this.getFlyerById(flyerId));
  }

  getAllFlyers() {
    return this.flyers;
  }

  getFlyerById(id) {
    return this.flyers.find(f => f.id === id);
  }

}

const noFrills = new NoFrills();

noFrills.init().then(() => {

  noFrills.emit('noFrills-initialized');

});

module.exports = noFrills;
