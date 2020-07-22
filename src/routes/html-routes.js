const express = require("express");

const isAuthenticated = require("../middleware/isAuthenticated");
const axios = require("axios");
const router = express.Router();

const Games = require("../models/games");

const baseUrl = "https://www.giantbomb.com/api/";
const apiKey = "/?api_key=64e95957a4b1b0cb263581d712fb0422aefb2ee6";
const limitAndJson = "&limit=1&format=json";

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
  const response = await axios({
    url: `${baseUrl}genres${apiKey}${limitAndJson}`,
    method: "GET",
  });
  console.log(response.data.results);
  res.render("dashboard", {
    genres: response.data.results,
  });
});
router.get("/genres/:id", async (req, res) => {
  const response = await axios({
    url: `${baseUrl}games${apiKey}${limitAndJson}`,
    method: "GET",
  });
  console.log(response.data.results);

  res.render("games", {
    game: response.data.results,
  });
});

router.post("/game", async (req, res) => {
  const { game_id, game_name, genre } = req.body;

  const cb = (result) => {
    res.redirect("/dashboard");
  };

  const payload = {
    game_id,
    game_name,
    genre,
    user_id: req.user.id,
    favourite_game: true,
  };
  Games.create(payload).then(cb);
});

module.exports = router;
