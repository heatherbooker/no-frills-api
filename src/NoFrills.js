/**
 * @file This class exposes methods to get various groupings of stores & flyers.
 */
const scraper = require('./scraper');


class NoFrills {

  constructor() {
    this.stores = [];
    this.maxFlyerId = 1;
  }

  init() {
    return scraper.scrape(this.maxFlyerId);
      .then(data => {
        this.stores = data.stores;
        this.flyers = data.flyers;
        this.maxFlyerId = data.newMaxFlyerId;
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

  getFlyerById(flyerId) {
    return this.flyers.filter(flyer => flyer.id === flyerId)[0];
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

  getAllFlyers() {
    return this.flyers;
  }

}

module.exports = NoFrills;
