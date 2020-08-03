const Sequelize = require("sequelize"),
  sequelize = require("../config/connection.js"),
  schema = {
    game_id: { type: Sequelize.INTEGER, allowNull: !1 },
    game_name: { type: Sequelize.STRING, allowNull: !1 },
    genre: { type: Sequelize.INTEGER, allowNull: !1 },
    user_id: { type: Sequelize.INTEGER, allowNull: !1 },
    favourite_game: { type: Sequelize.BOOLEAN, defaultValue: !1 },
  },
  Games = sequelize.define("games", schema);
Games.sync(), (module.exports = Games);
