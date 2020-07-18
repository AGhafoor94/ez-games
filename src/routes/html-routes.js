const express = require("express");

const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

const axios = require("axios");

const user = require("../models/user");

const game = require("../models/games");

router.get("/", (req, res) => {
  if (req.user) {
    res.redirect("/dashboard");
  }
  res.render("login");
});

router.get("/login", (req, res) => {
  if (req.user) {
    res.redirect("/dashboard");
  }
  res.render("login");
});

router.get("/signup", (req, res) => {});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/dashboard", isAuthenticated, async (req, res) => {
  res.render("dashboard", { email: req.user.email });
});

router.post("/test", async (req, res) => {
  const name = "Fallout";
  const settings = {
    url: "https://api-v3.igdb.com/games",
    method: "POST",
    timeout: 0,
    headers: {
      Accept: "application/json",
      "user-key": "878032e38a732e4781301afaf69add0a",
      "Content-Type": "text/plain",
      Cookie: "__cfduid=d3d5c0fcf3ee861790c0d0f11a789c0ff1594471408",
    },
    data: `fields *;where name = "${name}";`,
  };

  const response = await axios(settings);
  console.log(response.data);

  //res.render("favourite", { game: response.data });
  const cb = (result) => {
    res.send(result);
  };
  game.create(req.body.id, req.body.name, req.body.genres, 2, cb);
});

module.exports = router;
