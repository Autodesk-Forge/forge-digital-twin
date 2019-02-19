const express = require('express');
const { Purchase } = require('../model/procurement');

let router = express.Router();

router.get('/purchases', function(req, res) {
    Purchase.findAll(req.query.part ? { where: { partId: req.query.part } } : undefined)
        .then(purchases => res.json(purchases));
});

router.get('/purchases/:id', function(req, res) {
    Purchase.find({ where: { id: req.params.id } })
        .then(purchase => purchase ? res.json(purchase) : res.status(404).end());
});

router.post('/purchases', function(req, res) {
    const { supplier, price, partId } = req.body;
    Purchase.create({ supplier, price, partId })
        .then(purchase => res.json(purchase));
});

module.exports = router;