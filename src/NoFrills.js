/**
 * @file This class exposes methods to get various groupings of stores & flyers.
 */
const scraper = require('./scraper');


class NoFrills {

  constructor() {
    this.stores = [];
  }

  init() {
    return scraper.scrape()
      .then(stores => {
        this.stores = stores;
      });
  }

  getStoreById(id) {
    return this.stores.filter(store => store.id === id);
  }

  getStoresFromCity(city) {
    return this.stores.filter(store => store.address.city === city);
  }

  getStoresFromProvince(province) {
    return this.stores.filter(store => store.address.province === province);
  }

  getAllStores() {
    return this.stores;
  }

}

module.exports = NoFrills;
