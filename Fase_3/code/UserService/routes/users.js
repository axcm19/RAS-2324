var express = require('express');
var router = express.Router();
var User = require('../controllers/user')
const passport = require('passport')
const jwt = require('jsonwebtoken');

/* POST Register user. */
// Authenticates the user based on middleware from the auth module
router.post(
  '/register',
  passport.authenticate('signup', { session: false }),
  async (req, res, next) => {
    res.json({
      message: 'Signup successful',
      user: req.user
    });
  })

router.post(
  '/login',
  function (req, res, next) {
    passport.authenticate(
      'login',
      { session: false },
      function (err, user, info) {
        if (err || !user) {
          console.log(info)
          const error = new Error('An error occurred.');
          return next(error);
        }

        req.login(
          user,
          { session: false },
          async (error) => {
            if (error) return next(error);

            const body = { _id: user._id, email: user.email };
            const token = jwt.sign({ user: body }, process.env.SECRET_KEY);

            return res.json({ token });
          }
        );
      }
    )(req, res, next); // Invoke the passport.authenticate middleware
  }
);

module.exports = router;

