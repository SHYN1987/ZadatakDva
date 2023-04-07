const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

const apiRoutes = require("./routes/apiRoutes");
const docRoutes = require("./documentation.js");

//MongoDB config
require("./loaders/db");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger("dev"));

app.use("/api", apiRoutes);
app.use("/api", docRoutes);

app.listen(process.env.PORT);
