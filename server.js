const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()

const app = express();
require("./api/routes/project.routes.js")(app);

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors());


// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Project Management Application" });
});

// set port, listen for requests
const PORT = process.env.API_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
app.use(function (req, res, next) {
  // Website we wish to allow to connect, should be changed for production
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Request methods we wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')

  // Request headers we wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-Requested-With,content-type,XMLHttpRequest')

  next()
})

const db = require("./api/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database succesfully!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });