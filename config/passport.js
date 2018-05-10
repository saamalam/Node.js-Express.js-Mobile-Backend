const passport = require('passport');
const request = require('request');

const LocalStrategy = require('passport-local').Strategy;


const Admin = require('../models/Admin');

passport.serializeUser((admin, done) => {
  done(null, admin.id);
});

passport.deserializeUser((id, done) => {
  Admin.findById(id, (err, admin) => {
    done(err, admin);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  Admin.findOne({ email: email.toLowerCase() }, (err, admin) => {
    if (err) { return done(err); }
    if (!admin) {
      return done(null, false, { msg: `Email ${email} not found.` });
    }
    admin.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, admin);
      }
      return done(null, false, { msg: 'Invalid email or password.' });
    });
  });
}));



/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.admin.tokens.find(token => token.kind === provider);
  if (token) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};
