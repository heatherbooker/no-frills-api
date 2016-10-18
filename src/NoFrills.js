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
        this.flyers = this._extractFlyersFromStores(stores);
      });
  }

  _extractFlyersFromStores(stores) {
    const flyersByStore = stores.map(store => store.flyers);
    const allFlyers = [];
    flyersByStore.forEach(storeFlyers => {
      allFlyers.push(...storeFlyers);
    });
    return allFlyers;
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

  getAllFlyers() {
    return this.flyers;
  }

  getAllCurrentFlyers() {
    const flyersByStore = this.stores.map(store => store.flyers);
    let currentFlyers = [];
    flyersByStore.forEach(storeFlyers => {
      if (storeFlyers.length > 0) {
        let latestFlyer = {id: '0'};
        storeFlyers.forEach(flyer => {
          if (flyer.id > latestFlyer.id) {
            latestFlyer = flyer;
          }
        });
        currentFlyers.push(latestFlyer);
      }
    });
    return currentFlyers;
  }

}

module.exports = NoFrills;
