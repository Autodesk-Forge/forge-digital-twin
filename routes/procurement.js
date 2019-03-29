const express = require('express');
const { Purchase } = require('../model/procurement');

let router = express.Router();

const PurchaseTableLimit = 256;

function countPurchases() {
    return new Promise(function(resolve, reject) {
        Purchase.count({}, (err, count) => {
            if (err) {
                reject(err);
            } else {
                resolve(count);
            }
        });
    });
}

router.get('/purchases', function(req, res) {
    let query = {};
    if (req.query.parts) {
        query.partId = {
            $in: req.query.parts.split(',').map(val => parseInt(val))
        };
    }
    Purchase.find(query, (err, purchases) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(purchases);
        }
    });
});

router.get('/purchases/:id', function(req, res) {
    Purchase.findOne({ id: req.params.id }, function(err, purchase) {
        if (err) {
            res.status(500).send(err);
        } else if (!purchase) {
            res.status(404).end();
        } else {
            res.json(purchase);
        }
    });
});

router.post('/purchases', async function(req, res) {
    const { supplier, price, partId } = req.body;
    try {
        const numPurchases = await countPurchases();
        if (numPurchases >= PurchaseTableLimit) {
            throw new Error('Cannot add more purchases.');
        }

        const purchase = await Purchase.create({ createdAt: new Date(), supplier, price, partId });
        res.json(purchase);
    } catch(err) {
        res.status(500).send(err);
    }
});

module.exports = router;
