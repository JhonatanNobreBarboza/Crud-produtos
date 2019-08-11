const express = require("express");
const bodyParser = require("body-parser");
//const nodemailer = require('nodemailer')
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

require("./app/controllers/index")(app);
//require('./app/controllers/authController')(app);

const port = process.env.PORT || 8080;

app.listen(8080);
console.log("servidor on!");
console.log("Our app is running on http://localhost:" + port);
