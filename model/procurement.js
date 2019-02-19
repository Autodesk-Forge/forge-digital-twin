const Sequelize = require('sequelize');
const db = require('./db');

const Purchase = db.define('purchase',
    {
        supplier: Sequelize.STRING,
        price: Sequelize.FLOAT,
        partId: Sequelize.INTEGER
    },
    {
        indexes: [{ fields: ['partId'] }]
    }
);

module.exports = {
    Purchase
};