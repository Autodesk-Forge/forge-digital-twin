const express = require('express');
const Op = require('sequelize').Op;
const { Purchase } = require('../model/procurement');

let router = express.Router();

const PurchaseTableLimit = 256;

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

router.post('/purchases', async function(req, res) {
    const { supplier, price, partId } = req.body;
    const numPurchases = await Purchase.count();
    if (numPurchases >= PurchaseTableLimit) {
        res.status(405).send('Cannot add more purchases.');
        return;  
    }

    try {
        const purchase = await Purchase.create({ supplier, price, partId });
        res.json(purchase);
    } catch(err) {
        res.status(400).send(err);
    }
});

module.exports = router;