var passport = require('passport');

module.exports = function(app, options) {
  if (!app)
    throw new Error("Express app must be specified");

  if (!options)
    throw new Error("Google oauth options must be specified");

  if (!options.baseURL)
    throw new Error("Google oauth base URL must be specified");

  var Strategy = require('passport-google-oauth').OAuth2Strategy;
  var strategy = new Strategy({
    clientID: options.clientID,
    clientSecret: options.clientSecret,
    callbackURL: options.baseURL + 'auth/googleoauth/return'
  },exports.callback);

  passport.use("googleoauth", strategy);

  app.get('/auth/googleoauth',
      passport.authenticate('googleoauth', { scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile' }));

  app.get('/auth/googleoauth/return',
          passport.authenticate('googleoauth', { failureRedirect: '/' }),
          redirectOnSuccess);

  function redirectOnSuccess(req, res) {
    if (req.session.redirect) {
      redir = req.session.redirect;
      delete req.session.redirect;
    }
    res.redirect(redir);
  };
}

