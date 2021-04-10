module.exports = (app, passport) => {
  var bodyParser = require('body-parser')
  var jsonParser = bodyParser.json()
  const projects = require("../controllers/project.controller.js");
  const { verifyToken } = require("../validation");

  function ensureAuthenticated(req,res,next) {
    if(req.isAuthenticated()) {return next();}
        res.redirect('/'); // if failed...
    }

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  var router = require("express").Router();

  // Create a new Project
  router.post("/", jsonParser, projects.create);

  // Retrieve all Projects by Condition
  router.get("/completed",  projects.findAllCompleted);


  // TASKS
  // Update a TASK with ID
  router.put("/updatetask/:id", projects.updateTask);
  // Delete a TASK with ID
  router.put("/deletetask/:id", projects.deleteTask);
  // Add a new TASK by Column ID
  router.put("/addtask/:id", projects.addTask);


  //COLUMNS
  // Delete Column with ID
  router.put("/deletecolumn/:id", projects.deleteColumn);
  // Add a new Column by Project ID
  router.put("/addcolumn/:id", projects.addColumn);
  // Edit column name by ID
  router.put("/editcolumn/:id", projects.editColumn);

  //PROJECTS
  // Add user to project
  router.post("/add-user", passport.authenticate('jwt', {session: false}), projects.addUser);
  // Remove user from project
  router.post("/remove-user", passport.authenticate('jwt', {session: false}), projects.removeUser);
  // Add user to task
  router.put("/task/add-user", passport.authenticate('jwt', {session: false}), projects.addUserToTask);
  // Add user to task
  router.put("/task/remove-user", passport.authenticate('jwt', {session: false}), projects.removeUserfromTask);
  // Retrieve all Project owned by user
  router.get("/", passport.authenticate('jwt', {session: false}), projects.findAll);
  // Retrieve all Projects a user is invited to
  router.get("/invited", passport.authenticate('jwt', {session: false}), projects.findAllInvited);
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