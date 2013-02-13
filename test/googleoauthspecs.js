
var mongoose = require("mongoose");
var passport = require('passport');
var expect = require("expect.js");
var express = require("express");

var UserSchema = new mongoose.Schema();

var User = mongoose.model("User", UserSchema);

UserSchema.add({
  displayName: {type: String}
});


describe("Google OAuth", function() {
  var googleoAuth;
  var app;
  beforeEach(function() {
    app = express();
    googleoAuth = require("../lib/providers/googleoauth");
    googleoAuth(app, {clientID: "abc", clientSecret: "def", baseURL: "/"});

  });
  
  it("throws an error if app isn't specified", function() {
    var googleoAuth = require("../lib/providers/googleoauth");

    try {
      googleoAuth(null, {clientID: "abc", clientSecret: "def"});
      expect().fail("Expected exception that wasn't thrown");
    }
    catch(e) {
      expect(e.message).to.contain("app must be specified");
    }
  });

  it("throws an error if options aren't specified", function() {
    var googleoAuth = require("../lib/providers/googleoauth");

    try {
      googleoAuth(app);
      expect().fail("Expected exception that wasn't thrown");
    }
    catch(e) {
      expect(e.message).to.contain("options must be specified");
    }
  });

  it("throws an error if the base URL isn't specified", function() {
    var googleoAuth = require("../lib/providers/googleoauth");

    try {
      googleoAuth(app, {clientID: "abc", clientSecret: "def"});
      expect().fail("Expected exception that wasn't thrown");
    }
    catch(e) {
      expect(e.message).to.contain("base URL must be specified");
    }
  });
  

  it("registers the Google oauth2 strategy", function() {
    var strategy = passport._strategies["googleoauth"];
    expect(strategy).to.be.ok();
  });

  it("passes through the provided auth token info", function() {
    var strategy = passport._strategies["googleoauth"];
    expect(strategy._oauth2._clientId).to.equal("abc");
    expect(strategy._oauth2._clientSecret).to.equal("def");
    expect(strategy._callbackURL).to.equal("/auth/googleoauth/return");
    
  });
  
  it("registers login route", function() {
    var routeExists = app.routes.get.some(function(route) {
      return route.path == "/auth/googleoauth";
    });

    console.log(app.routes);
    expect(routeExists).to.be.ok();
    
  });

  it("registers the callback route", function() {
    var routeExists = app.routes.get.some(function(route) {
      return route.path == "/auth/googleoauth/return";
    });

    expect(routeExists).to.be.ok();
  });

  it("redirects to a default URL when login was successful", function() {
  });

  it("redirects to a url specified in the session when login was successful", function() {
  });

  it("uses the provided google oauth scope", function() {
  });
  
  it("adds the Google fields to the User schema", function() {
  });
  
  it("returns the user ", function() {
    
  });
  
  
  
});



