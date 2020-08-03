const passport = require("passport"),
  Strategy = require("passport-local").Strategy,
  User = require("../models/user"),
  EMAIL_ERROR_MESSAGE = "Incorrect email address",
  PASSWORD_ERROR_MESSAGE = "Incorrect password",
  verifyCallback = async (a, b, c) => {
    const d = await User.findOne({ where: { email: a } });
    return d
      ? d.validPassword(b)
        ? c(null, d)
        : c(null, !1, { message: PASSWORD_ERROR_MESSAGE })
      : c(null, !1, { message: EMAIL_ERROR_MESSAGE });
  },
  localStrategy = new Strategy({ usernameField: "email" }, verifyCallback);
passport.use(localStrategy),
  passport.serializeUser((a, b) => {
    b(null, a);
  }),
  passport.deserializeUser((a, b) => {
    b(null, a);
  }),
  (module.exports = passport);
