const express = require("express");

const isAuthenticated = require("../middleware/isAuthenticated");
const axios = require("axios");
const router = express.Router();

const Games = require("../models/games");

const baseUrl = "https://www.giantbomb.com/api/";
const apiKey = `?api_key=${process.env.API_KEY}`;
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
    url: `${baseUrl}games${apiKey}${limitAndJson}&filter=original_release_date:${req.params.id}-01-01`,
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
router.post("/game", isAuthenticated, async (req, res) => {
  const { search, searchOptions } = req.body;
  let response;
  switch (searchOptions) {
    case "releases":
      response = await axios({
        url: `${baseUrl}releases${apiKey}${limitAndJson}&filter=name:${search}`,
        method: "GET",
      });
      res.render("game", {
        game: response.data.results,
      });
      break;
    case "game-name":
      response = await axios({
        url: `${baseUrl}games${apiKey}${limitAndJson}&filter=name:${search}`,
        method: "GET",
      });
      res.render("game", {
        game: response.data.results,
      });
      break;
    case "year":
      parseInt(search);
      response = await axios({
        url: `${baseUrl}games${apiKey}${limitAndJson}&filter=original_release_date:${search}-01-01`,
        method: "GET",
      });
      res.render("game", {
        game: response.data.results,
      });
      break;
    case "platform":
      response = await axios({
        url: `${baseUrl}platforms${apiKey}${limitAndJson}&filter=name:${search}`,
        method: "GET",
      });
      res.render("console", {
        console: response.data.results,
      });
      break;
    case "platformGames":
      response = await axios({
        url: `${baseUrl}games${apiKey}${limitAndJson}&filter=platforms:${search}`,
        method: "GET",
      });
      res.render("game", {
        game: response.data.results,
      });
      break;
  }
});
router.get("/game/:id", isAuthenticated, async (req, res) => {
  const response = await axios({
    url: `${baseUrl}games${apiKey}${limitAndJson}&filter=platforms:${req.params.id}`,
    method: "GET",
  });
  res.render("game", {
    game: response.data.results,
  });
});
router.post("/year/:id", isAuthenticated, async (req, res) => {
  const { game_id, game_name } = req.body;
  console.log(game_name);
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
