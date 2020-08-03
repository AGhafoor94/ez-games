const express = require("express"),
  passport = require("../config/passport"),
  User = require("../models/user"),
  Games = require("../models/games"),
  router = express.Router();
router.get("/dashboard", (a, b) => {
  a.user ? b.json({ email: a.user.email, id: a.user.id }) : b.status(401);
}),
  router.post("/auth/login", passport.authenticate("local"), (a, b) => {
    b.json(a.user);
  }),
  router.post("/auth/signup", async (a, b) => {
    try {
      const { email: c, password: d } = a.body;
      await User.create({ email: c, password: d }), b.redirect(302, "/login");
    } catch (a) {
      b.status(401).json(a);
    }
  }),
  (module.exports = router);
