const express = require('express');
const Op = require('sequelize').Op;
const { Part, Review, Issue } = require('../model/maintenance');

let router = express.Router();

router.get('/revisions', function(req, res) {
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
    Review.findAll(query).then(reviews => res.json(reviews));
});

router.post('/revisions', async function(req, res) {
    const { partId, author, passed, description } = req.body;
    await Part.findOrCreate({
        where: { id: partId },
        defaults: {
            id: partId,
            status: 'ok',
            nextReview: null
        }
    });
    const review = await Review.create({ partId, author, passed, description });
    res.json(review);
});

router.get('/issues', function(req, res) {
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
    Issue.findAll(query).then(issues => res.json(issues));
});

router.post('/issues', async function(req, res) {
    const { partId, author, text, img, x, y, z } = req.body;
    await Part.findOrCreate({
        where: { id: partId },
        defaults: {
            id: partId,
            status: 'ok',
            nextReview: null
        }
    });
    const issue = await Issue.create({ partId, author, text, img, x, y, z });
    res.json(issue);
});

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

module.exports = router;