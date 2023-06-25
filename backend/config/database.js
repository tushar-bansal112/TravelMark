const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

module.exports = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  port: 5432,
  pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
  }
  });