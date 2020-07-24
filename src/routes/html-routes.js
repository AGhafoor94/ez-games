const express = require("express");

const isAuthenticated = require("../middleware/isAuthenticated");
const axios = require("axios");
const router = express.Router();

const Games = require("../models/games");

const baseUrl = "https://www.giantbomb.com/api/";
const apiKey = "?api_key=64e95957a4b1b0cb263581d712fb0422aefb2ee6";
const limitAndJson = "&format=json";

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

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/dashboard", isAuthenticated, async (req, res) => {
  const year = [];
  for (let i = 2000; i < 2021; i++) {
    year.push({ name: i });
  }
  res.render("dashboard", {
    genres: year,
  });
});

router.get("/year/:id", async (req, res) => {
  const response = await axios({
    url: `${baseUrl}games${apiKey}${limitAndJson}&filter=original_release_date:${req.params.id}-01-01&score:5`,
    method: "GET",
  });

  res.render("games", {
    game: response.data.results,
  });
});

router.get("/profile", isAuthenticated, async (req, res) => {
  const user_id = req.user.id;
  const response = await Games.findAll({
    where: { user_id },
    raw: true,
  });
  res.render("profile", { response });
});

router.post("/profile/:id", isAuthenticated, async (req, res) => {
  const { favourite_game, game_id } = req.body;
  if (favourite_game === "1") {
    Games.update({ favourite_game: false }, { where: { game_id } }).then(() =>
      res.redirect("/profile")
    );
  }
  if (favourite_game === "0") {
    Games.update({ favourite_game: true }, { where: { game_id } }).then(() =>
      res.redirect("/profile")
    );
  }
});
router.delete("/profile/:id", isAuthenticated, async (req, res) => {
  const { game_id } = req.body;
  await Games.remove({ game_id }, { where: { game_id } });
  res.redirect("/profile");
});
router.post("/year/:id", isAuthenticated, async (req, res) => {
  const { game_id, game_name } = req.body;

  const cb = (result) => {
    res.redirect("/dashboard");
  };

  const payload = {
    game_id,
    game_name,
    genre: req.params.id,
    user_id: req.user.id,
    favourite_game: false,
  };
  Games.create(payload).then(cb);
});

module.exports = router;
