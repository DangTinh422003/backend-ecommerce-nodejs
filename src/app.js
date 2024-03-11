const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();
const app = express();

// use middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
const instanceMongodb = require("./dbs/init.mongodb");
const { checkOverload } = require("./helpers/check.connect");

// init routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
