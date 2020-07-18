const express = require("express");

const isAuthenticated = require("../middleware/isAuthenticated");
const axios = require("axios");
const router = express.Router();

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
  if (req.user) {
    res.redirect("/dashboard");
  }
  res.render("signup");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/dashboard", isAuthenticated, async (req, res) => {
  const response = await axios({
    url: "https://api-v3.igdb.com/genres",
    method: "POST",
    headers: {
      Accept: "application/json",
      "user-key": "878032e38a732e4781301afaf69add0a",
    },
    data: "fields id, name; limit 100;",
  });
  console.log(response.data);

  res.render("dashboard", {
    genres: response.data,
  });
});
router.get("/:id", async (req, res) => {
  const response = await axios({
    url: "https://api-v3.igdb.com/games",
    method: "POST",
    headers: {
      Accept: "application/json",
      "user-key": "878032e38a732e4781301afaf69add0a",
    },
    data: `fields id, cover, genres, name, similar_games, summary; where genres = ${req.params.id}; limit 100;`,
  });

  res.render("games", {
    game: response.data,
  });
});
module.exports = router;
