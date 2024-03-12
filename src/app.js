const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();

// use middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// init db
const instanceMongodb = require("./dbs/init.mongodb");
const { checkOverload } = require("./helpers/check.connect");

// init routes
app.use(require("./routes"));

module.exports = app;
