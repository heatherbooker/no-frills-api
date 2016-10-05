/**
 * @file Extractor used by the scraper to format the flyer objects.
 */
function extractFlyer(flyerData) {

  if (arguments.length > 1) {
    throw new Error('Error extracting flyer details: too many arguments!');
  }

  const products = extractProducts(flyerData.flyerResponse.docs);
  const dates = flyerData.weekRange.split(' - ');
  return {
    products,
    start_date: dates[0],
    end_date: dates[1]
  };
}

function extractProducts(arrayOfProducts) {

  if (arguments.length > 1) {
    throw new Error('Error extracting products: too many arguments!');
  }

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

module.exports = extractFlyer;
