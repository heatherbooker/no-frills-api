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
    return scraper.scrape()
      .then(data => {
        this.provinces = data.provinces;
        this.flyers = data.flyers;
      });
  }

  getAllStores() {
    return this.provinces;
  }

}

module.exports = NoFrills;
