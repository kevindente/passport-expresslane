var Strategy = require('passport-google-oauth').OAuth2Strategy;
var OAuth2Adapter = require("../oauth2adapter");

module.exports = function(app, options) {
  if (!app)
    throw new Error("Express app must be specified");

  if (!options)
    throw new Error("Google oauth options must be specified");

  if (!("baseURL" in options))
    throw new Error("Google oauth base URL must be specified");

  if (!("verifyCallback" in options))
    throw new Error("Verify callback must be specified");

  return new GoogleoAuthAdapter(app, options);
};

function GoogleoAuthAdapter(app, options) {
  this.name = "googleoauth";
  this.scope = options.scope || 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
  this.strategy = Strategy;

  OAuth2Adapter.call(this, app, options);
}

require("util").inherits(GoogleoAuthAdapter, OAuth2Adapter);
