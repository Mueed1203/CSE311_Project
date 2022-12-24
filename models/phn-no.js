const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const phnNo = sequelize.define('phn-no', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  phn_Number: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

module.exports = phnNo;
