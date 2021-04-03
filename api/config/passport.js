const db = require("../models");
const user = db.users;          
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require("bcrypt");

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : process.env.TOKEN_SECRET
},
function (jwtPayload, cb) {

    return user.findOne({ _id: jwtPayload.id })
        .then(user => {
            return cb(null, user);
        })
        .catch(err => {
            return cb(err);
        });
}
));

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    async function (email, password, cb) {
        await user.findOne({ email })
           .then(async user => {
               if (!user) {
                   return cb('Incorrect E-mail');
               }
                const validPassword = await bcrypt.compare(
                    password,
                    user.password
                );
                if (!validPassword) {
                    return cb('Incorrect Password');
                }

               return cb(null, user, {message: 'Logged In Successfully'});
          })
          .catch(err => console.log(err));
    }
));

module.exports = { passport }