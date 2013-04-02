var passport = require('passport');

var Strategy = require('passport-facebook').Strategy;
var OAuth2Adapter = require("../oauth2adapter");

module.exports = function(app, options) {
  if (!app)
    throw new Error("Express app must be specified");

  if (!options)
    throw new Error("Facebook oauth options must be specified");

  if (!("baseURL" in options))
    throw new Error("Facebook oauth base URL must be specified");

  if (!("verifyCallback" in options))
    throw new Error("Verify callback must be specified");

  return new FacebookoAuthAdapter(app, options);
};

function FacebookoAuthAdapter(app, options) {
  this.name = "facebookoauth";
  this.scope = options.scope || 'email';
  this.strategy = Strategy;

  OAuth2Adapter.call(this, app, options);
}

require("util").inherits(FacebookoAuthAdapter, OAuth2Adapter);
