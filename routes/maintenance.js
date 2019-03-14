const express = require('express');
const Op = require('sequelize').Op;
const { Part, Review, Issue } = require('../model/maintenance');

let router = express.Router();

const PartTableLimit = 2048; // note: the jet engine model has cca 1600 parts
const ReviewTableLimit = 256;
const IssueTableLimit = 256;

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
    const numParts = await Part.count();
    const numReviews = await Review.count();
    if (numParts >= PartTableLimit) {
        res.status(405).send('Cannot register more parts.');
        return;        
    } else if (numReviews >= ReviewTableLimit) {
        res.status(405).send('Cannot add more reviews.');
        return;
    }

    try {
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
    } catch(err) {
        res.status(400).send(err);
    }
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
    const numParts = await Part.count();
    const numIssues = await Issue.count();
    if (numParts >= PartTableLimit) {
        res.status(405).send('Cannot register more parts.');
        return;  
    } else if (numIssues >= IssueTableLimit) {
        res.status(405).send('Cannot add more issues.');
        return;
    }

    try {
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
    } catch(err) {
        res.status(400).send(err);
    }
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

router.put('/parts/:id', async function(req, res) {
    let updates = {};
    if (req.body.status) {
        updates.status = req.body.status;
    }
    if (req.body.nextReview) {
        updates.nextReview = req.body.nextReview;
    }

    try {
        const part = await Part.update(updates, { where: { id: req.params.id } });
        res.json(part);
    } catch(err) {
        res.status(400).send(err);
    }
});

module.exports = router;