const express = require('express');
const { Part, Review, Issue } = require('../model/maintenance');

let router = express.Router();

const PartTableLimit = 2048; // note: the jet engine model has cca 1600 parts
const ReviewTableLimit = 256;
const IssueTableLimit = 256;

function countParts() {
    return new Promise(function(resolve, reject) {
        Part.count({}, (err, count) => {
            if (err) {
                reject(err);
            } else {
                resolve(count);
            }
        });
    });
}

function countReviews() {
    return new Promise(function(resolve, reject) {
        Review.count({}, (err, count) => {
            if (err) {
                reject(err);
            } else {
                resolve(count);
            }
        });
    });
}

function countIssues() {
    return new Promise(function(resolve, reject) {
        Issue.count({}, (err, count) => {
            if (err) {
                reject(err);
            } else {
                resolve(count);
            }
        });
    });
}

function findOrCreatePart(id) {
    return new Promise(function(resolve, reject) {
        Part.findOne({ id }, (err, part) => {
            if (err) {
                reject(err);
            } else if (part) {
                resolve(part);
            } else {
                Part.create({ id, createdAt: new Date(), status: 'ok' }, function(err, part) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(part);
                    }
                });
            }
        });
    });
}

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

router.get('/revisions', function(req, res) {
    let query = {};
    if (req.query.parts) {
        query.partId = {
            $in: req.query.parts.split(',').map(val => parseInt(val))
        };
    }
    Review.find(query, (err, reviews) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(reviews);
        }
    });
});

let authors = ['Sherbaum Valery','Erenburg Vladimir','John Golley','Wilbert Awdry','Bill Gunston','Klaus Hünecke','Irwin E. Treager'];
let types = ['Minor','Major','Urgent','Critical'];
let recommendations = ['Repair','Replace','Discard','Change']
let status = [true,false]

router.post('/revisions', async function(req, res) {
    const { partId, author, passed, description } = req.body;
    if (authors.contains(author) && status.contains(passed) && recommendations.contains(description)) {        
        try {
            const numParts = await countParts();
            const numReviews = await countReviews();
            if (numParts >= PartTableLimit) {
                throw new Error('Cannot register more parts.')
            } else if (numReviews >= ReviewTableLimit) {
                throw new Error('Cannot register more reviews.')
            }
            
            await findOrCreatePart(partId);
            const review = await Review.create({ createdAt: new Date(), partId, author, passed, description });
            res.json(review);
        } catch(err) {
            res.status(500).send(err);
        }
    } else {
        res.status(400).send({'error':'need to select from given options'});
    }
});

router.get('/issues', function(req, res) {
    let query = {};
    if (req.query.parts) {
        query.partId = {
            $in: req.query.parts.split(',').map(val => parseInt(val))
        };
    }
    Issue.find(query, (err, issues) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(issues);
        }
    });
});

router.post('/issues', async function(req, res) {
    const { partId, author, text, img, x, y, z } = req.body;
    if (authors.contains(author) && types.contains(text)) {        
        try {
            const numParts = await countParts();
            const numIssues = await countIssues();
            if (numParts >= PartTableLimit) {
                throw new Error('Cannot register more parts.');
            } else if (numIssues >= IssueTableLimit) {
                throw new Error('Cannot register more issues.');
            }
            
            await findOrCreatePart(partId);
            const issue = await Issue.create({ createdAt: new Date, partId, author, text, img, x, y, z });
            res.json(issue);
        } catch(err) {
            res.status(500).send(err);
        }
    } else {
        res.status(400).send({'error':'need to select from given options'});
    }
});

router.get('/parts/:id', async function(req, res) {
    try {
        let part = await findOrCreatePart(req.params.id);
        res.json(part);
    } catch(err) {
        res.status(500).send(err);
    }
});

router.put('/parts/:id', function(req, res) {
    let query = {
        id: req.params.id
    };
    let updates = {};
    if (req.body.status) {
        updates.status = req.body.status;
    }
    if (req.body.nextReview) {
        updates.nextReview = req.body.nextReview;
    }
    Part.findOneAndUpdate(query, updates, function(err, part) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(part);
        }
    });
});

module.exports = router;
