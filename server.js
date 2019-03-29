const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');

const { FORGE_CLIENT_ID, FORGE_CLIENT_SECRET, FORGE_MODEL_URN, MONGODB_URL } = process.env;
if (!FORGE_CLIENT_ID || !FORGE_CLIENT_SECRET || !FORGE_MODEL_URN || !MONGODB_URL) {
    console.warn('Provide all the following env. variables to run this application:');
    console.warn('FORGE_CLIENT_ID, FORGE_CLIENT_SECRET, FORGE_MODEL_URN, MONGODB_URL');
    return;
}

const db = require('./model/db');
const app = express();

app.use(helmet());
app.set('view engine', 'pug');
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/procurement', require('./routes/procurement'));
app.use('/api/maintenance', require('./routes/maintenance'));

const port = process.env.PORT || 3000;
db.connect()
    .then(() => app.listen(port, () => console.log(`Server listening on port ${port}`)))
    .catch((err) => console.error(err));