const Sequelize = require("sequelize");

const localOptions = {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
};

const productionOptions = {
  host: process.env.HOSTNAME,
  port: 3306,
  dialect: "mysql",
  use_env_variable: "JAWSDB_URL",
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
};

let sequelize;

sequelize = new Sequelize("ez_games", "root", "password", localOptions);
module.exports = sequelize;
