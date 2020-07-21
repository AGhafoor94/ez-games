const express = require("express");

const isAuthenticated = require("../middleware/isAuthenticated");
const axios = require("axios");
const router = express.Router();

const Games = require("../models/games");

router.get("/", (req, res) => {
  if (req.user) {
    res.redirect(`/dashboard`);
  }
  res.render("login");
});

router.get("/login", (req, res) => {
  if (req.user) {
    res.redirect(`/dashboard`);
  }
  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.user) {
    res.redirect(`/dashboard`);
  }
  res.render("signup");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/dashboard", isAuthenticated, async (req, res) => {
  res.redirect(`/dashboard/${req.user.id}`);
});
router.get("/dashboard/:id", isAuthenticated, async (req, res) => {
  const response = await axios({
    url: "https://api-v3.igdb.com/genres",
    method: "POST",
    headers: {
      Accept: "application/json",
      "user-key": "878032e38a732e4781301afaf69add0a",
    },
    data: "fields id, name; limit 100;",
  });

  //const { cover } = response.data;

  res.render("dashboard", {
    genres: response.data,
  });
});

newData = [];
router.get("/genres/:id", async (req, res) => {
  //newData.splice(0, newData.length);
  const response = await axios({
    url: "https://api-v3.igdb.com/games",
    method: "POST",
    headers: {
      Accept: "application/json",
      "user-key": "878032e38a732e4781301afaf69add0a",
    },
    data: `fields id, cover, genres, name, cover, summary; where genres = ${req.params.id}; limit 2;`,
  });

  //console.log(response.data);

  response.data.forEach(async (element) => {
    const response2 = await axios({
      method: "post",
      url: "https://api-v3.igdb.com/covers/",
      headers: {
        Accept: "application/json",
        "user-key": "878032e38a732e4781301afaf69add0a",
        "Content-Type": "application/json",
      },
      data: `fields *;\nwhere id = ${element.cover};\n`,
    });
    //console.log(element);
    //console.log(response2.data);

    let newObject = Object.assign(element, { url: response2.data[0].url });
    newData.push(newObject);
    //console.log(newData);
  });

  console.log(newData);
  res.render("games", {
    game: newData,
  });
  newData = [];
});

router.get("/profile/:id", async (req, res) => {
  const id = req.params.id;
  const response = await Games.findAll({
    where: id === Games.user_id,
  });

  let profileRespond = [];
  response.forEach((element) => {
    profileRespond.push(element.dataValues);
  });
  console.log(profileRespond);

  //console.log(response);
  res.render("profile", {
    games: profileRespond,
  });
});

router.post("/game", async (req, res) => {
  const { game_id, game_name, genre } = req.body;

  const cb = (result) => {
    res.redirect("/games");
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
