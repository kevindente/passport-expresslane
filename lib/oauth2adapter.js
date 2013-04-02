var passport = require('passport');
var url = require('url');

function OAuth2Adapter(app, options) {
  this.options = options;

  var baseURL = options.baseURL;
  if (baseURL.charAt(baseURL.length - 1) != '/')
    baseURL += '/';

  if (!this.strategy) 
    throw new Error("No Passport Strategy provided");

  var strategy = new this.strategy({
    clientID: options.clientID,
    clientSecret: options.clientSecret,
    callbackURL: url.resolve(baseURL, 'auth/' + this.name + '/return')
  },this.callback.bind(this));

  passport.use(this.name, strategy);

  app.get('/auth/' + this.name,
      passport.authenticate(this.name, 
          { scope: this.scope }));

  app.get('/auth/' + this.name + '/return',
          passport.authenticate(this.name, { failureRedirect: '/' }),
          this.redirectOnSuccess.bind(this));
}

OAuth2Adapter.prototype.redirectOnSuccess = function(req, res) {
  var redir = this.options.redirectOnSuccess || "/";
  if (req.session && req.session.redirect) {
    redir = req.session.redirect;
    delete req.session.redirect;
  }
  res.redirect(redir);
};

OAuth2Adapter.prototype.callback = function(accessToken, refreshToken, profile, done) {
  this.options.verifyCallback({accessToken: accessToken,
                               refreshToken: refreshToken,
                               profile: profile},
                               done);
};



module.exports = OAuth2Adapter;

