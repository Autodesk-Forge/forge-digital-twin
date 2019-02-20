const express = require('express');
const Op = require('sequelize').Op;
const { Purchase } = require('../model/procurement');

let router = express.Router();

router.get('/purchases', function(req, res) {
    let query = undefined;
    if (req.query.parts) {
        query = {
            where: {
                partId: {
                    [Op.or]: req.query.parts.split(',').map(val => parseInt(val))
                }
            }
        };
    }
    Purchase.findAll(query).then(purchases => res.json(purchases));
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