const express = require("express"),
  axios = require("axios"),
  router = express.Router(),
  isAuthenticated = require("../middleware/isAuthenticated"),
  Games = require("../models/games"),
  baseUrl = "https://www.giantbomb.com/api/",
  apiKey = `?api_key=${process.env.API_KEY}`,
  limitAndJson = "&format=json";
router.get("/", (a, b) => {
  a.user && b.redirect("/dashboard"), b.render("login");
}),
  router.get("/login", (a, b) => {
    a.user && b.redirect("/dashboard"), b.render("login");
  }),
  router.get("/signup", (a, b) => {
    b.render("signup");
  }),
  router.get("/logout", (a, b) => {
    a.logout(), b.redirect("/");
  }),
  router.get("/dashboard", isAuthenticated, async (a, b) => {
    const c = [];
    for (let d = 2e3; 2021 > d; d++) c.push({ name: d });
    b.render("dashboard", { genres: c });
  }),
  router.get("/year/:id", async (a, b) => {
    const c = await axios({
      url: `${baseUrl}games${apiKey}${limitAndJson}&filter=original_release_date:${a.params.id}-01-01`,
      method: "GET",
    });
    b.render("games", { game: c.data.results });
  }),
  router.get("/profile", isAuthenticated, async (a, b) => {
    const c = a.user.id,
      d = await Games.findAll({ where: { user_id: c }, raw: !0 });
    b.render("profile", { response: d });
  }),
  router.post("/profile/:id", isAuthenticated, async (a, b) => {
    const { favourite_game: c, game_id: d } = a.body;
    "1" === c &&
      Games.update({ favourite_game: !1 }, { where: { game_id: d } }).then(() =>
        b.redirect("/profile")
      ),
      "0" === c &&
        Games.update(
          { favourite_game: !0 },
          { where: { game_id: d } }
        ).then(() => b.redirect("/profile"));
  }),
  router.post("/game", isAuthenticated, async (a, b) => {
    const { search: c, searchOptions: d } = a.body;
    let e;
    "releases" === d
      ? ((e = await axios({
          url: `${baseUrl}releases${apiKey}${limitAndJson}&filter=name:${c}`,
          method: "GET",
        })),
        b.render("game", { game: e.data.results }))
      : "game-name" === d
      ? ((e = await axios({
          url: `${baseUrl}games${apiKey}${limitAndJson}&filter=name:${c}`,
          method: "GET",
        })),
        b.render("game", { game: e.data.results }))
      : "year" === d
      ? (parseInt(c),
        (e = await axios({
          url: `${baseUrl}games${apiKey}${limitAndJson}&filter=original_release_date:${c}-01-01`,
          method: "GET",
        })),
        b.render("game", { game: e.data.results }))
      : "platform" === d
      ? ((e = await axios({
          url: `${baseUrl}platforms${apiKey}${limitAndJson}&filter=name:${c}`,
          method: "GET",
        })),
        b.render("console", { console: e.data.results }))
      : "platformGames" === d
      ? ((e = await axios({
          url: `${baseUrl}games${apiKey}${limitAndJson}&filter=platforms:${c}`,
          method: "GET",
        })),
        b.render("game", { game: e.data.results }))
      : void 0;
  }),
  router.get("/game/:id", isAuthenticated, async (a, b) => {
    const c = await axios({
      url: `${baseUrl}games${apiKey}${limitAndJson}&filter=platforms:${a.params.id}`,
      method: "GET",
    });
    b.render("game", { game: c.data.results });
  }),
  router.post("/year/:id", isAuthenticated, async (a, b) => {
    const { game_id: c, game_name: d } = a.body,
      e = {
        game_id: c,
        game_name: d,
        genre: a.params.id,
        user_id: a.user.id,
        favourite_game: !1,
      };
    Games.create(e).then(() => {
      b.redirect("/dashboard");
    });
  }),
  (module.exports = router);
