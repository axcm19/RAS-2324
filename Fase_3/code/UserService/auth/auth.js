const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/user');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

// Passport middleware to handle user registration
// saves the information provided by the user to the database, 
// and then sends the user information to the next middleware 
// if successful
passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      console.log(req)
      try {
        const role = req.body.role;
        const username = req.body.username;
        const user = await UserModel.create({ email, password, role, username});

        return done(null, user);
      } catch (error) {
        console.log(error)
        done(error);
      }
    }
  )
);

// Passport middleware to handle user login
passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email: email });
        
        // If the user does not match any users in the database
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const validate = await user.isValidPassword(password);
        
        // If the password does not match the password associated with the user in the database
        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }
        
        // If the user and password match
        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET_KEY,
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);