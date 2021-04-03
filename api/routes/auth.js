    const router = require("express").Router();
    const user = require("../controllers/user.controller.js");
    
    // function isLoggedIn(req, res, next) {

    //     // if user is authenticated in the session, carry on 
    //     if (req.isAuthenticated())
    //         return next();
    
    //     // if they aren't redirect them to the home page
    //     res.redirect('/');
    // }

    router.post('/register', user.create);
    router.post('/login', user.login);
    router.post('/info', user.getUsersData);
    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    })

module.exports = router;