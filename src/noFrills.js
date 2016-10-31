/**
 * @file This class exposes methods to get various groupings of stores & flyers.
 */
const EventEmitter = require('events');
const scraper = require('./scraper');


class NoFrills extends EventEmitter {

  constructor() {
    super();
    this.provinces = [];
    this.flyers = [];
  }

  init() {
    return new Promise((resolve, reject) => {
      // Use saved data if available.
      const fs = require('fs');
      const fileName = './data/finalNoFrillsData.json';
      fs.readFile(fileName, (err, fileData) => {
        if (err) {
          scraper.scrape().then(data => {
            fs.writeFileSync(fileName, JSON.stringify(data));
            resolve(data);
          });
        } else {
          resolve(JSON.parse(fileData));
        }
      });
    })
      .then(data => {
        this.provinces = data.provinces;
        this.flyers = data.flyers;
      });
  }

  getAllStores() {
    return this.provinces;
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
