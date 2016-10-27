/**
 * @file Extractor used by the scraper to format the flyer objects.
 */
function extractFlyer(data, nofrillsData) {
  const flyerData = JSON.parse(data);

  if (flyerData.weekRange) {

    const products = extractProducts(flyerData.flyerResponse.docs);
    const dates = flyerData.weekRange.split(' - ');
    const storeId = /storenum@([0-9]*)\./.exec(flyerData.flyerUrl);
    // Ids are strings for consistency with other data in nofrills object.
    // The id of a flyer is one more than the id of the latest flyer.
    const flyerId = String(nofrillsData.flyers.length + 1);
    const flyer = {
      products,
      start_date: dates[0],
      end_date: dates[1],
      store_id: storeId[1],
      id: flyerId
    };
    addFlyerToNoFrills(flyer, nofrillsData);
  }
  return nofrillsData;
}

function extractProducts(arrayOfProducts) {

  return arrayOfProducts.map(product => {

    if (product.priceSavings === 'n/a') {
      product.priceSavings = null;
    } else {
      product.priceSavings = product.priceSavings.replace('SAVE ', '');
    }

    // Removes HTML tags found in product.description.
    product.description = product.description
      .replace(/<.*?>/g, '');

    // Product description in French is last part of description, after 2 '\n'.
    var descriptions = product.description.split('/\n\n');
    product.description = descriptions[0].trim();
    product.french = descriptions[1] || null;

    return removeNullProperties(product);

  });
}

function removeNullProperties(product) {

  // These properties are always null.
  var nullProperties = ['points', 'rank', 'itemDetailsUrl', 'flyerUrl'];

  nullProperties.forEach(nullProp => {
    delete product[nullProp];
  });

  return product;
}

function addFlyerToNoFrills(flyer, nofrillsData) {
  nofrillsData.flyers.push(flyer);
  // Finds the appropriate store in nofrillsData to add flyer ids to.
  const storeId = flyer.store_id;

  for (let i = 0; i < nofrillsData.provinces.length; i++) {
    const numOfCities = nofrillsData.provinces[i].cities.length;
    for (let j = 0; j < numOfCities; j++) {

      const stores = nofrillsData.provinces[i].cities[j].stores;
      const store = stores.find(s => s.id === storeId);
      if (store) {
        store.flyer_ids.push(flyer.id);
        return nofrillsData;
      }
    }
  }
  return nofrillsData;
}

module.exports = extractFlyer;
