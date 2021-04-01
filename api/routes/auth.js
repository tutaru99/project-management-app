    const router = require("express").Router();
    const bcrypt = require('bcrypt')
    const user = require("../controllers/user.controller.js");

    router.post('/register', user.create)
    router.post('/login', async (req, res) => {
        
    }) 

    module.exports = router