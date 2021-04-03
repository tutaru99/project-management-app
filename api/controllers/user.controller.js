const db = require("../models");
const user = (project = db.users); /* WORKAROUND FOR NOW  - READ/WRITE  */
const { registerValidation, loginValidation } = require("../validation.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

exports.create = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const emailExist = await user.findOne({ email: req.body.email });

  if (emailExist) {
    return res.status(400).json({ error: "Email already eists" });
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const userObject = new user({
    username: req.body.username,
    email: req.body.email,
    password,
  });

  try {
    const savedUser = await userObject.save();
    res.json({ error: null, data: savedUser._id });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.login = async (req, res) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: err.length ? err : "Something went wrong...",
          user: user,
        });
      }
      
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }
        // generate a signed son web token with the contents of user object and return it in the response
        const token = jwt.sign(
          {
            name: user.username,
            id: user._id,
          },
          process.env.TOKEN_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }
        );

        res.status(200).send({ username: user.username, id: user._id, token });
      });
    }
  )(req, res);
};

exports.getUsersData = async (req, res) => {
  var usersDetails = [];

  for (let index = 0; index < req.body.length; index++){
    await db.users.findById(req.body[index]).then(result => {
      const data = {
        username: result.username,
        email: result.email,
      }
      usersDetails.push(data)
    }).catch (error => {
      res.status(400).json({ error });
    })
  }
  if (usersDetails) {
    res.status(200).json(usersDetails)
  } else {
    res.status(404)
  }
}
