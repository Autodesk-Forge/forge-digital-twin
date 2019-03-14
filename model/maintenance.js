const Sequelize = require('sequelize');
const db = require('./db');

const AuthorValidation = {
    len: [0, 64]
};

const DescriptionValidation = {
    len: [0, 256]
};

const ImageUrlValidation = {
    len: [0, 256]
};

const StatusValidation = {
    isIn: [['ok', 'good', 'bad']]
};

const Part = db.define('part',
    {
        id: { type: Sequelize.INTEGER, primaryKey: true },
        status: { type: Sequelize.STRING, validate: StatusValidation },
        nextReview: Sequelize.DATE
    }
);

const Review = db.define('review',
    {
        author: { type: Sequelize.STRING, validate: AuthorValidation },
        passed: Sequelize.BOOLEAN,
        description: { type: Sequelize.TEXT, validate: DescriptionValidation }
    }
);
Review.belongsTo(Part);

const Issue = db.define('issue',
    {
        author: { type: Sequelize.STRING, validate: AuthorValidation },
        text: { type: Sequelize.TEXT, validate: DescriptionValidation },
        img: { type: Sequelize.STRING, validate: ImageUrlValidation },
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