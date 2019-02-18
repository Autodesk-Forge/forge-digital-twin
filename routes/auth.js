const express = require('express');
const { AuthenticationClient } = require('autodesk-forge-tools');

let router = express.Router();
let auth = new AuthenticationClient(process.env.FORGE_CLIENT_ID, process.env.FORGE_CLIENT_SECRET);

router.get('/token', async function(req, res, next) {
    try {
        const result = await auth.authenticate(['viewables:read']);
        res.json({ access_token: result });
    } catch(err) {
        next(err);
    }
});

module.exports = router;