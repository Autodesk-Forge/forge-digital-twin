const express = require('express');

let router = express.Router();

router.get('/', function(req, res) {
    res.render('index', { analytics: process.env.GOOGLE_ANALYTICS_TAG });
});

module.exports = router;