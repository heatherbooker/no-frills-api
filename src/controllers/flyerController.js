/* eslint new-cap: "off" */
const router = require('express').Router();
const noFrills = require('../NoFrills.js');


router.get('/', (req, res) => {

  res.send(noFrills.getAllFlyers());

});

router.get('/:id', (req, res) => {

  res.send(noFrills.getFlyerById(req.params.id));

});

module.exports = router;
