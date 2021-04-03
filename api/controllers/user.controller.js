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

        // res.cookie('jwt', token , { maxAge: 900000, httpOnly: true });
        
        // res.cookie('jwt', token, { domain: 'http://localhost:8080', path: '/', expires: new Date(Date.now() + 9000000), httpOnly: false });
        res.status(200).send({ username: user.username, id: user._id, token });
      });
    }
  )(req, res);

  // const { error } = loginValidation(req.body);
  // if (error) {
  //     return res.status(400).json({ error: error.details[0].message});
  // }

  // const foundUser = await user.findOne({ email: req.body.email });
  // if (!foundUser) {
  //     return res.status(400).json({ error: "Email is not registered!" });
  // }

  // const validPassword = await bcrypt.compare(req.body.password, foundUser.password)

  // if (!validPassword) {
  //     return res.status(400).json({ error: "Password is wrong!" });
  // }

  // const token = jwt.sign(
  //     {
  //         name: foundUser.username,
  //         id: foundUser._id
  //     },
  //     process.env.TOKEN_SECRET,
  //     { expiresIn: process.env.JWT_EXPIRES_IN }
  // )

  // res.header('auth-token', token).json({
  //     error: null,
  //     data: { token }
  // })
};
