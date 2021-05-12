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
/*   router.get("/completed",  projects.findAllCompleted); */


  // TASKS
  // Update a TASK with ID
  router.put("/updatetask/:id", passport.authenticate('jwt', {session: false}), projects.updateTask);
  // Update a TASK with ID
  router.put("/updatetask-quick-edit/:id", passport.authenticate('jwt', {session: false}), projects.updateTaskQuickEdit);
  // Delete a TASK with ID
  router.put("/deletetask/:id", passport.authenticate('jwt', {session: false}), projects.deleteTask);
  // Add a new TASK by Column ID
  router.put("/addtask/:id", passport.authenticate('jwt', {session: false}), projects.addTask);
  // Add a new TASK by Column ID
  router.put("/movetask/:id/:columnId", passport.authenticate('jwt', {session: false}), projects.moveTask);
  // Move task in the same column
  router.put("/movetasksamecolumn/:columnId", passport.authenticate('jwt', {session: false}), projects.moveTaskSameColumn);


  //COLUMNS
  // Delete Column with ID
  router.put("/deletecolumn/:id", passport.authenticate('jwt', {session: false}), projects.deleteColumn);
  // Add a new Column by Project ID
  router.put("/addcolumn/:id", passport.authenticate('jwt', {session: false}), projects.addColumn);
  // Edit column name by ID
  router.put("/editcolumn/:id", passport.authenticate('jwt', {session: false}), projects.editColumn);

  //PROJECTS
  // Add user to project
  router.post("/add-user", passport.authenticate('jwt', {session: false}), projects.addUser);
  // Remove user from project
  router.post("/remove-user", passport.authenticate('jwt', {session: false}), projects.removeUser);
  // Remove user from project
  router.put("/change-user-permission", passport.authenticate('jwt', {session: false}), projects.changeUserPermissionForProject);
  // Add user to task
  router.put("/task/add-user", passport.authenticate('jwt', {session: false}), projects.addUserToTask);
  // Add user to task
  router.put("/task/remove-user", passport.authenticate('jwt', {session: false}), projects.removeUserfromTask);
  // Retrieve all Project owned by user
  router.get("/", passport.authenticate('jwt', {session: false}), projects.findAll);
  // Retrieve all Projects a user is invited to
  router.get("/invited", passport.authenticate('jwt', {session: false}), projects.findAllInvited);
  // Retrieve a single Project by ID
  router.get("/:id", passport.authenticate("jwt", { session: false }), projects.findOne);
  // Update a Project with ID
  router.put("/:id", passport.authenticate("jwt", { session: false }), projects.update);
  // Delete a Project with ID
  router.delete("/:id", passport.authenticate("jwt", { session: false }), projects.delete);



  // DELETE ALL Projects
  // router.delete("/", passport.authenticate("jwt", { session: false }), projects.deleteAll);


  app.use('/api/projects', router);
};