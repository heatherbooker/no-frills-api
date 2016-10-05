/**
 * @file Extractor used by the scraper to format the store data.
 */
function extractStore(storeData) {
  var store = {address: {}};
  store.id = storeData.storeNumber;
  store.address.street_address = storeData.address.addressLine1.trim() + storeData.address.addressLine2;
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
  if (ownershipRegex.test(storeName) > -1) {
    return storeName.replace(ownershipRegex, '');
  }
  return null;
}

module.exports = extractStore;
