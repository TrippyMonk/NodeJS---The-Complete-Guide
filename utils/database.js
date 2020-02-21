const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodejs-complete', 'root', 'Bushki11er', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;