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
    const flyerIds = this.getStoreById(storeId).flyer_ids;
    return flyerIds.map(id => this.getFlyerById(id));
  }

  getFlyerById(id) {
    return this.flyers.filter(flyer => flyer.id === id)[0];
  }

  getAllFlyers() {
    return this.flyers;
  }

}

module.exports = NoFrills;
