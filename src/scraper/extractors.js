function extractProducts(arrayOfProducts) {
  return arrayOfProducts.map(product => {
    product.priceSavings = product.priceSavings.replace('SAVE ', '');
    product.description = product.description
      .replace(/<.*?>/g, '')
    var descriptions = product.description.split('/\n\n');
    product.description = descriptions[0].trim();
    product.french = descriptions[1];
    return removeNullProperties(product);
  });
}

function removeNullProperties(product) {
  var nullProperties = ['points', 'rank', 'itemDetailsUrl', 'flyerUrl', 'correctionNotice', 'priceSavings'];
  nullProperties.forEach(nullProp => {
    if (!product[nullProp] || product[nullProp] === 'n/a') {
      delete product[nullProp];
    }
  });
  return product;
}

module.exports = {
  products: extractProducts
};
