const express = require('express');
const path = require('path');

const { FORGE_CLIENT_ID, FORGE_CLIENT_SECRET } = process.env;
if (!FORGE_CLIENT_ID || !FORGE_CLIENT_SECRET) {
    console.warn('Provide FORGE_CLIENT_ID and FORGE_CLIENT_SECRET env. variables to run this application.');
    return;
}

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/auth'));

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Server listening on port ${port}`); });