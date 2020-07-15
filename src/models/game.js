const Sequelize = require("sequelize");
const sequelize = require("../config/connection.js");
const gamesSchema = {
    id: {
        type: sequelize.INTERGER,
        allowNull: false,
    },
    user_id: {
        type: sequelize.INTERGER(10),
        validate: {
            len: [4,10]
        },
        alllowNull: false
    },
    game_names: {
        type: sequelize.STRING(50),
        validate: {
            len:
             [4, 50]
        },
        allowNull: false
    },
    ratings: {
        type: sequelize.INTERGER(5),
        allowNull: false
    },

};
const Game = sequelize.define("ez_gamesDB", gamesSchema);
ez_gamesDB.sync();
module.exports = Game;