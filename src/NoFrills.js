/**
 * @file This class exposes methods to get various groupings of stores & flyers.
 */
const scraper = require('./scraper');


class NoFrills {

  constructor() {
    this.provinces = [];
    this.flyers = [];
  }

  init() {
    return new Promise((resolve, reject) => {
      const fs = require('fs');
      fs.readFile('./data/finalNoFrillsData.json', (err, fileData) => {
        if (err) {
          scraper.scrape().then(data => {
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

}

module.exports = NoFrills;
