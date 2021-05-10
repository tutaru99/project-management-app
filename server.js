const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require('passport');
require('dotenv').config();
require('./api/config/passport.js');
const authRoutes = require("./api/routes/auth.js");

const app = express();

//swagger dependencies
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

//setup swagger
const swaggerDefinition = yaml.load('api/swagger.yaml');
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));


app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());
// app.use('/api/user', passport.authenticate('jwt', {session: false}), authRoutes)
app.use('/api/user', authRoutes)
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Project Management Application" });
});

// set port, listen for requests
const PORT = process.env.API_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

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
    
require("./api/routes/project.routes.js")(app, passport);
