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

const Issue = db.define('issue',
    {
        author: Sequelize.STRING,
        text: Sequelize.TEXT,
        img: Sequelize.STRING,
        x: Sequelize.FLOAT,
        y: Sequelize.FLOAT,
        z: Sequelize.FLOAT
    }
);
Issue.belongsTo(Part);

module.exports = {
    Part,
    Review,
    Issue
};