/**
 * @file Extracts details from strings of product data to return data in an organized object form.
 */
function extract(data) {
  var trimmedData = data.trim();
  var separators = /\s{4}(.*)\s{3}/;
  var splitData = trimmedData.split(separators);
  var labeledData = {
    price: splitData[0],
    name: splitData[1],
    details: splitData[2]
  };

  var savings = labeledData.price.split(/\s{2}/);
  if (savings.length > 1) {
    labeledData.price = savings[0];
    labeledData.savings = savings[1];
  }

  return labeledData;
}

module.exports = {
  extract: extract
};
