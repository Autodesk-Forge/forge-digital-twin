const Sequelize = require('sequelize');
const db = require('./db');

const Part = db.define('part',
    {
        id: { type: Sequelize.INTEGER, primaryKey: true },
        status: Sequelize.STRING,
        nextReview: Sequelize.DATE
    }
);

const Review = db.define('review',
    {
        author: Sequelize.STRING,
        passed: Sequelize.BOOLEAN,
        description: Sequelize.TEXT
    }
);

Review.belongsTo(Part);

module.exports = {
    Part,
    Review
};