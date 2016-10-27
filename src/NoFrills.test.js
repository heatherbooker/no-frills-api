var assert = require('chai').assert;
var NoFrills = require('./NoFrills.js');
var nofrills;


describe('NoFrills class', function() {

  beforeEach(function() {
    nofrills = new NoFrills;
    return nofrills.init().then(function() {
      console.log('now we done initializing');
    });
  });

  describe('NoFrills getAllStores method', function() {
    
    it('should return an array of store objects', function() {
      var stores = nofrills.getAllStores();
      assert.isArray(stores);
      assert.isObject(stores[0]);
    });

  });

});
