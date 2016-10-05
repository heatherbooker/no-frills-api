/**
 * @file Extractor used by the scraper to format the product objects.
 */
function extractProducts(arrayOfProducts) {

  // If there's more than one argument, it may be because the
  // objects should have been aggregated into an array.
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
    product.french = descriptions[1];

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

module.exports = extractProducts;
