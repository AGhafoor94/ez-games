const bcrypt = require("bcryptjs"),
  Sequelize = require("sequelize"),
  sequelize = require("../config/connection.js"),
  salt = bcrypt.genSaltSync(10),
  schema = {
    email: {
      type: Sequelize.STRING,
      allowNull: !1,
      unique: !0,
      validate: { isEmail: !0 },
    },
    password: { type: Sequelize.STRING, allowNull: !1 },
  },
  User = sequelize.define("user", schema);
(User.prototype.validPassword = function (a) {
  return bcrypt.compareSync(a, this.password);
}),
  User.addHook("beforeCreate", (a) => {
    a.password = bcrypt.hashSync(a.password, salt, null);
  }),
  User.sync(),
  (module.exports = User);
