const Router = require('express').Router;
const router = new Router();
const noFrills = require('../noFrills.js');


router.get('/', (req, res) => {

  res.send(noFrills.getAllStores());

});

module.exports = router;
