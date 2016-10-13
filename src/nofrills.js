/**
 * @file These functions will be used by the server according to the route.
 */
const scraper = require('./scraper');


class NoFrills {

  constructor() {

    scraper.scrapeStores()
      .then(stores => {
        this.stores = stores;
      });
      // .then(() => {

      //   return getAllFlyers();
      // })
      // .then(flyers => {
      //   this.flyers = flyers;
      // });
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

  getFlyerByStoreId(id) {
    return this.flyers.filter(flyer => flyer.store_id === id);
  }

  getFlyersFromCity(city) {
    return this.flyers.filter(flyer => {
      var storeForFlyer = this.getStoreById(flyer.store_id);
      return storeForFlyer.address.city === city;
    });
  }

  getFlyersFromProvince(province) {
    return this.flyers.filter(flyer => {
      var storeForFlyer = this.getStoreById(flyer.store_id);
      return storeForFlyer.address.province === province;
    });
  }

  getAllFlyers() {
    return this.flyers;
  }

}

module.exports = NoFrills;
