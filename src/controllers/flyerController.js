const Router = require('express').Router;
const router = new Router();
const noFrills = require('../noFrills.js');


router.get('/', (req, res) => {

  res.send(noFrills.getAllFlyers());

});

router.get('/:id', (req, res) => {

  res.send(noFrills.getFlyerById(req.params.id));

});

module.exports = router;
