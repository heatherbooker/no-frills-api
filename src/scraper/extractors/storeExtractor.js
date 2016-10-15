/**
 * @file Extractor used by the scraper to format the store data.
 */
const flyerExtractor = require('./flyerExtractor.js');


function extractStores(data) {
  const stores = JSON.parse(data);
  return stores.map(store => {
    const extractedStore = extractStore(store);
    return {
      store: extractedStore,
      endpoint: getFlyerEndpoint(extractedStore.id),
      extractor: flyerExtractor,
      delay: 5000
    };
  });
}

function getFlyerEndpoint(storeId) {
  // Use an absurdly high number of products to ensure we always get them all.
  const numOfProducts = '10000';
  return {
    url: `http://www.nofrills.ca/banners/publication/v1/en_CA/NOFR/current/${storeId}/items?start=0&rows=${numOfProducts}&tag=`,
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  };
}

function extractStore(storeData) {

  var store = {address: {}};
  store.id = storeData.storeNumber;
  store.address.street_address = storeData.address.addressLine1.trim() +
                                 storeData.address.addressLine2;
  store.address.city = storeData.address.city;
  store.address.province = storeData.address.province;
  store.address.postal_code = storeData.address.postalCode;
  store.departments = extractDepartments(storeData.departments);
  store.owner = extractOwner(storeData.storeName);
  store.manager = storeData.manager.contactName || null;
  store.phone_number = storeData.phoneNumber;
  store.hours = extractHours(storeData.operatingHours);
  return store;
}

function extractDepartments(storeDepartments) {
  return storeDepartments.map(department => {
    return department.departmentNameEn;
  });
}

function extractHours(storeHours) {
  var hours = {holidays: null};
  storeHours.forEach(day => {
    hours[day.day] = day.hours;
    if (day.holiday) {
      if (!hours.holidays) {
        hours.holidays = [];
      }
      hours.holidays.push(day.day);
    }
  });
  return hours;
}

function extractOwner(storeName) {
  // "Bob's NOFRILLS" indicates Bob is the owner.
  var ownershipRegex = /'s .+/;
  if (ownershipRegex.test(storeName)) {
    return storeName.replace(ownershipRegex, '');
  }
  // Sometimes the above doesn't catch an owner.
  var firstRegexFailed = storeName.split(/NOFRILLS|No Frills/);
  if (firstRegexFailed.length > 1) {
    var end = (firstRegexFailed[0].length - 3);
    return firstRegexFailed[0].substring(0, end);
  }
  return null;
}

module.exports = extractStores;
