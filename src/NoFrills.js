/**
 * @file This class exposes methods to get various groupings of stores & flyers.
 */
const scraper = require('./scraper');


class NoFrills {

  constructor() {
    this.stores = [];
    this.flyers = [];
  }

  init() {
    return scraper.scrape()
      .then(data => {
        this.stores = data.stores;
        this.flyers = data.flyers;
      });
  }

  getStoreById(id) {
    return this.stores.find(store => store.id === id);
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

  getFlyersForStore(storeId) {
    const flyerIds = this.getStoreById(storeId).flyer_ids;
    return flyerIds.map(id => this.getFlyerById(id));
  }

  getFlyerById(id) {
    return this.flyers.find(flyer => flyer.id === id);
  }

  getAllFlyers() {
    return this.flyers;
  }

}

module.exports = NoFrills;
