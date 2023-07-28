// db.js
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('singleservice', 'nazhifhaidar', '123Haidar!', {
  host: 'localhost',
  dialect: 'mysql', // or any other supported dialect (e.g., postgres, sqlite, etc.)
});

module.exports = sequelize ;
