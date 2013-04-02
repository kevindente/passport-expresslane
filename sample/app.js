
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , expresslane = require('../')
  , passport = require('passport');

var app = module.exports = express();

// Configuration


var users = {};
var authConfig = require("./authinfo");

authConfig.googleoauth.verifyCallback = function(authInfo, cb) {
  var user = {username: authInfo.profile.displayName, id: authInfo.profile.id};
  users[authInfo.profile.id] = user;
  cb(null, user);
};

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  expresslane(app, authConfig);
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, users[id]);
});
// Routes

app.get('/', routes.index);

app.listen(3002, function(){
  // console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  console.log("Express server listening on port %d in %s mode", 3002, app.settings.env);
});
