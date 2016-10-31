const Router = require('express').Router;
const router = new Router();
const noFrills = require('../noFrills.js');


router.get('/', (req, res) => {

  res.send(noFrills.getAllStores());

});

router.get('/:id', (req, res) => {

  res.send(noFrills.getStoreById(req.params.id));

});

module.exports = router;
