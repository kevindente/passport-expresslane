var path = require("path");
var passport = require("passport");

module.exports = function(app, config) {

  if (!app)
    throw new Error("An Express app must be specified");

  if (!config)
    throw new Error("Configuration options must be specified");

  return new Expresslane(app, config);
};


function Expresslane(app, config) {
  var adapter;
  this.adapters = [];
  app.use(passport.initialize());
  app.use(passport.session());

  for (var opt in config) {
    try {
      adapter = require(path.resolve(path.join(__dirname, "lib", "adapters", opt)));
    }
    catch (err) {
      if (err.code == 'MODULE_NOT_FOUND') {
        throw new Error("Invalid adapter specified - " + opt);
      }
    }
    
    this.adapters.push(adapter(app, config[opt]));
  }

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
}
