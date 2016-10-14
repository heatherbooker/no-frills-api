/**
 * @file These functions will be used by the server according to the route.
 */
const scraper = require('./scraper');


class NoFrills {

  constructor() {
    this.stores = [];
  }

  init() {
    return scraper.scrapeStores()
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
