const Sequelize = require('sequelize');

module.exports = new Sequelize(process.env.DB_CONNECTION_URI || 'sqlite:data/database.sqlite');