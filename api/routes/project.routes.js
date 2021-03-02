module.exports = app => {
  var bodyParser = require('body-parser')
  var jsonParser = bodyParser.json()
  const projects = require("../controllers/project.controller.js");

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  var router = require("express").Router();

  // Create a new Project
  router.post("/", jsonParser, projects.create);

  // Retrieve all Projects by Condition
  router.get("/completed", projects.findAllCompleted);

  // Delete a TASK with ID
  router.put("/deletetask/:id", projects.deleteTask);

  // Add a new TASK by Column ID
  router.put("/addtask/:id", projects.addTask);

  // Retrieve all Project
  router.get("/", projects.findAll);

  // Retrieve a single Project by ID
  router.get("/:id", projects.findOne);


  // Update a Project with ID
  router.put("/:id", projects.update);

  // Delete a Project with ID
  router.delete("/:id", projects.delete);


  // DELETE ALL Projects
  router.delete("/", projects.deleteAll);

  app.use('/api/projects', router);
};