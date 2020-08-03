const express = require("express"),
  session = require("express-session"),
  expressHandlebars = require("express-handlebars"),
  path = require("path"),
  passport = require("./config/passport"),
  apiRoutes = require("./routes/api-routes"),
  htmlRoutes = require("./routes/html-routes"),
  PORT = process.env.PORT || 8080,
  app = express(),
  sessionOptions = {
    secret: "keyboard cat",
    resave: !0,
    saveUninitialized: !0,
  },
  hbOptions = {
    defaultLayout: "main",
    layoutsDir: "src/views/layouts",
    partialsDir: "src/views/partials",
  };
app.use(express.urlencoded({ extended: !0 })),
  app.use(express.json()),
  app.use(express.static(path.join(__dirname, "/public"))),
  app.engine("handlebars", expressHandlebars(hbOptions)),
  app.set("view engine", "handlebars"),
  app.set("views", path.join(__dirname, "views")),
  app.use(session(sessionOptions)),
  app.use(passport.initialize()),
  app.use(passport.session()),
  app.use("/api", apiRoutes),
  app.use("/", htmlRoutes),
  app.listen(PORT, () => {
    console.log(`Navigate to http://localhost:${PORT}`);
  });
