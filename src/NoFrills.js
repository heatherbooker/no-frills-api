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
    return this.stores.filter(store => store.id === id)[0];
  }

  getStoresByCity(city) {
    return this.stores.filter(store => store.address.city === city);
  }

  getStoresByProvince(province) {
    return this.stores.filter(store => store.address.province === province);
  }

  getAllStores() {
    return this.stores;
  }

  getFlyersForStore(storeId) {
    return this.getStoreById(storeId).flyers;
  }

  getFlyerById(storeId, flyerId) {
    const flyers = this.getFlyersForStore(storeId);
    return flyers.filter(flyer => flyer.id === flyerId)[0];
  }

}

module.exports = NoFrills;
