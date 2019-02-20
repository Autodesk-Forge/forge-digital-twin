const express = require('express');
const { Part, Review } = require('../model/maintenance');

let router = express.Router();

router.get('/parts/:id', function(req, res) {
    Part.findOrCreate({
        where: { id: req.params.id },
        defaults: {
            id: req.params.id,
            status: 'ok',
            nextReview: null
        }
    }).spread((part, created) => res.json(part));
});

router.put('/parts/:id', function(req, res) {
    let updates = {};
    if (req.body.status) {
        updates.status = req.body.status;
    }
    if (req.body.nextReview) {
        updates.nextReview = req.body.nextReview;
    }
    Part.update(updates, {
        where: { id: req.params.id }
    }).then(part => res.json(part));
});

router.get('/parts/:id/reviews', function(req, res) {
    Review.findAll({
        where: { partId: req.params.id }
    }).then(reviews => res.json(reviews));
});

router.post('/parts/:id/reviews', function(req, res) {
    const { author, passed, description } = req.body;
    Review.create({ author, passed, description, partId: req.params.id })
        .then(review => res.json(review));
});

module.exports = router;