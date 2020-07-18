const express = require("express");

const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

const axios = require("axios");

const User = require("../models/user");

const Games = require("../models/games");

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

router.post("/game", async (req, res) => {
  console.log("POST!!");
  //res.render("favourite", { game: response.data });
  const cb = (result) => {
    res.redirect("/dashboard");
  };

  //const payload = {
  //  game_id: 1,
  //  game_name: "Fallout 4",
  //  genre: 5,
  //  user_id: 2,
  //  favourite_game: true,
  //};

  Games.create(req.body).then(cb);
});

module.exports = router;
