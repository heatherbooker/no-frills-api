var assert = require('chai').assert;
var extract = require('./storeExtractor.js');


var testStore;

describe('store extractor', function() {

  beforeEach(function() {
    testStore = {
      "id": "100",
      "storeName": "Gil's YIG Balmoral",
      "storeNumber": "635",
      "pcPlus": true,
      "bilingual": false,
      "flyerBanner": "YIG",
      "todaysHours": "7:00 AM - 9:00 PM",
      "phoneNumber": "506-826-2545",
      "faxNumber": "506-826-1994",
      "flyerUrl": `/en_CA/flyers.pageview.banner@YIG.storenum@635.week@current.html`,
      "storeUrl": "/en_CA/storedetail.100.html",
      "bannerUrl": "/en_CA.html",
      "couponUrl": "/en_CA/flyers.banner@YIG.coupon.storenum@635.html",
      "address": {
        "addressLine1": "647 Des Pionniers Ave",
        "addressLine2": "",
        "addressLine3": "",
        "postalCode": "E8E 2W7",
        "city": "Balmoral",
        "province": "NB",
        "country": "CA",
        "latitude": 47.98132,
        "longitude": -66.41399
      },
      "banner": {
        "bannerName": "Your Independent Grocer",
        "logoUrl": `https://www.pcplus.ca/LCLOnline/images/logo_independent_sm_en.gif`,
        "bannerId": "20"
      },
      "manager": {
        "contactName": "",
        "email": "",
        "phoneNumber": ""
      },
      "departments": [{
        "departmentName": "PC Plus™",
        "departmentNameEn": "PC Plus™",
        "departmentNameFr": "PC Plus™",
        "departmentId": "137302449",
        "description": null,
        "descriptionFr": null,
        "managerName": null,
        "phoneNumber": "",
        "faxNumber": "",
        "pharmacy": null,
        "managerPhoto": null,
        "operatingHours": null,
        "proprietorName": "",
        "proprietorAddress": "",
        "proprietorRep": "",
        "todaysHours": null,
        "dietitianCalPdfUrl": "",
        "practitionerEmail": "",
        "practitionerPhoto": "",
        "practitionerProfile": "",
        "practitionerProfileFr": "",
        "medicalCategory": "",
        "medicalCategoryFr": "",
        "newDepartmentName": "",
        "newDepartmentNameFr": "",
        "errorMsg": null
      }, {
        "departmentName": "PC® MasterCard® PIN change",
        "departmentNameEn": "PC® MasterCard® PIN change",
        "departmentNameFr": `Changement du NIP de la carte MasterCard Services financiers le Choix du Président®`,
        "departmentId": "137302450",
        "description": null,
        "descriptionFr": null,
        "managerName": null,
        "phoneNumber": "",
        "faxNumber": "",
        "pharmacy": null,
        "managerPhoto": null,
        "operatingHours": null,
        "proprietorName": "",
        "proprietorAddress": "",
        "proprietorRep": "",
        "todaysHours": null,
        "dietitianCalPdfUrl": "",
        "practitionerEmail": "",
        "practitionerPhoto": "",
        "practitionerProfile": "",
        "practitionerProfileFr": "",
        "medicalCategory": "",
        "medicalCategoryFr": "",
        "newDepartmentName": "",
        "newDepartmentNameFr": "",
        "errorMsg": null
      }],
      "operatingHours": [{
        "date": "2016-10-05",
        "day": "Wednesday",
        "hours": "7:00 AM - 9:00 PM",
        "holiday": false
      }, {
        "date": "2016-10-06",
        "day": "Thursday",
        "hours": "7:00 AM - 9:00 PM",
        "holiday": false
      }, {
        "date": "2016-10-07",
        "day": "Friday",
        "hours": "7:00 AM - 9:00 PM",
        "holiday": false
      }, {
        "date": "2016-10-08",
        "day": "Saturday",
        "hours": "7:00 AM - 9:00 PM",
        "holiday": false
      }, {
        "date": "2016-10-09",
        "day": "Sunday",
        "hours": "8:00 AM - 8:00 PM",
        "holiday": false
      }, {
        "date": "2016-10-10",
        "day": "Monday",
        "hours": "8:00 AM - 9:00 PM",
        "holiday": true
      }, {
        "date": "2016-10-11",
        "day": "Tuesday",
        "hours": "7:00 AM - 9:00 PM",
        "holiday": false
      }],
      "combinedExceptionHours": [{
        "holiday": false,
        "holidayTitle": "Thanksgiving Day",
        "holidayTitleFr": "L'Action de Grâce",
        "hoursLabel": "08:00 AM - 09:00 PM",
        "hoursLabelFr": "08h00 - 21h00",
        "open": true,
        "startDayLabel": "Mon Oct 10",
        "startDayLabelFr": "lun. 10 oct.",
        "endDayLabel": null,
        "endDayLabelFr": null
      }],
      "exceptionHours": [],
      "distance": "521.1",
      "configuredDepartments": null
    };
  });

  it(`should return an object with 7 keys`, function() {
    var result = extract(testStore);
    assert.isObject(result);
    assert.lengthOf(Object.keys(result), 7);
  });

  it(`should return an object with key "address" whose value is an object with 4 keys`, function() {
    var result = extract(testStore);
    assert.isObject(result.address);
    assert.lengthOf(Object.keys(result.address), 4);
  });

  it(`should return an object with key "hours" whose value is an object with 8 keys`, function() {
    var result = extract(testStore);
    assert.isObject(result.hours);
    assert.lengthOf(Object.keys(result.hours), 8);
  });

  it('should throw an error given more than one input', function() {
    try {
      extract({some: "details"}, {could: 'beAnObject'});
      return false;
    } catch (err) {
      return true;
    }
  });

  it('should throw an error given an empty object', function() {
    try {
      extract({});
      return false;
    } catch (err) {
      return true;
    }
  });

});
