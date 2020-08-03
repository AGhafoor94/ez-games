const Sequelize = require("sequelize"),
  localOptions = {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    pool: { max: 5, min: 0, idle: 1e4 },
  },
  productionOptions = {
    host: process.env.HOSTNAME,
    port: 3306,
    dialect: "mysql",
    use_env_variable: "JAWSDB_URL",
    pool: { max: 5, min: 0, idle: 1e4 },
  };
let sequelize;
(sequelize =
  "production" === process.env.NODE_ENV
    ? new Sequelize(
        process.env.DATABASE,
        process.env.USERNAME,
        process.env.PASSWORD,
        productionOptions
      )
    : new Sequelize("ez_games", "root", "password", localOptions)),
  (module.exports = sequelize);
