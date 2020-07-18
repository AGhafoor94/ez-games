const express = require("express");
const axios = require("axios");

const isAuthenticated = require("../middleware/isAuthenticated");

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


router.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", { email: req.user.email });
});

router.get("/profile", isAuthenticated, async(req, res) => {
  const response = await axios({
    url:"https://api-v3.igdb.com/genres",
    method: "POST",
    headers:{
      Accept: "application/json", 
      "user-key": "878032e38a732e4781301afaf69add0a"
    },
    data:"fields *; limit 100;"
  });
console.log(response.data)
  res.render("profile", { games: response.data,
  });
});

module.exports = router;
