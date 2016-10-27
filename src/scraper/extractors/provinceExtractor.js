function extractProvinces(data, nofrillsData) {
  const provinces = JSON.parse(data).provincePrompt;
  const provinceCodes = provinces.map(province => ({code: province.label}));
  nofrillsData.provinces = provinceCodes;

  return nofrillsData;
}

module.exports = extractProvinces;
