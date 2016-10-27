/**
 * @file Extractor used by the scraper to format the store data.
 */
function extractStores(data, nofrillsData) {
  const stores = JSON.parse(data).map(store => {
    const extractedStore = extractStore(store);
    return extractedStore;
  });
  // Finds the appropriate city in nofrillsData to add stores to.
  const provinceCode = stores[0].address.province;
  const cityName = stores[0].address.city;
  const province = nofrillsData.provinces.find(p => p.code === provinceCode);
  const city = province.cities.find(city => city.name === cityName);
  city.stores = stores;

  return nofrillsData;
}

function extractStore(storeData) {

  var store = {address: {}};
  store.id = storeData.storeNumber;
  store.address.street_address = storeData.address.addressLine1.trim() +
                                 storeData.address.addressLine2;
  store.address.city = storeData.address.city.trim();
  store.address.province = storeData.address.province;
  store.address.postal_code = storeData.address.postalCode;
  store.departments = extractDepartments(storeData.departments);
  store.owner = extractOwner(storeData.storeName);
  store.manager = storeData.manager.contactName || null;
  store.phone_number = storeData.phoneNumber;
  store.hours = extractHours(storeData.operatingHours);
  store.flyer_ids = [];
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
  // "Bob's NOFRILLS" or "Kris' NoFrills" indicates Bob/Kris are owners.
  const match = /(.*)'s |(.*s)' /.exec(storeName);
  if (match) {
    return match[1] || match[2];
  }
  return null;
}

module.exports = extractStores;
