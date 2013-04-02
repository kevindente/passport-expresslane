var passport = require('passport');
var expect = require("expect.js");
var express = require("express");

var MockRequest = function() {
  this.session = {};
};

var MockResponse = function() {
  this.redirect = function(url) {
    this.url = url;
  };
};

describe("OAuth2 adapter", function() {
  var oAuth2;
  var app;
  var adapter;
  var config;
  beforeEach(function() {
    app = express();
    //Use the google adapter as our testbed
    //We'll test stuff that's not-google specific in this suite
    oAuth2 = require("../lib/adapters/googleoauth");
    config = {
      clientID: "abc", 
      clientSecret: "def", 
      baseURL: "http://www.myserver.com/",
      verifyCallback: function() {}
    };
    adapter = oAuth2(app, config);
  });

  it("handles a non-root base URL", function() {
    config = {
      clientID: "abc", 
      clientSecret: "def", 
      baseURL: "http://www.myserver.com/sub/path",
      verifyCallback: function() {}
    };

    oAuth2(app, config);

    var strategy = passport._strategies.googleoauth;
    expect(strategy._callbackURL).to.equal("http://www.myserver.com/sub/path/auth/googleoauth/return");
  });

  it("handles a base URL without a trailing slash", function() {
    config = {
      clientID: "abc", 
      clientSecret: "def", 
      baseURL: "http://www.myserver.com/a/path",
      verifyCallback: function() {}
    };

    oAuth2(app, config);

    var strategy = passport._strategies.googleoauth;
    expect(strategy._callbackURL).to.equal("http://www.myserver.com/a/path/auth/googleoauth/return");
  });

  it("passes through the provided auth token info", function() {
    var strategy = passport._strategies.googleoauth;
    expect(strategy._oauth2._clientId).to.equal("abc");
    expect(strategy._oauth2._clientSecret).to.equal("def");
    expect(strategy._callbackURL).to.equal("http://www.myserver.com/auth/googleoauth/return");
  });

  it("registers the oauth2 strategy", function() {
    var strategy = passport._strategies.googleoauth;
    expect(strategy).to.be.ok();
  });

  
  it("registers the login route", function() {
    var routeExists = app.routes.get.some(function(route) {
      return route.path == "/auth/googleoauth";
    });

    expect(routeExists).to.be.ok();
  });

  it("registers the callback route", function() {
    var routeExists = app.routes.get.some(function(route) {
      return route.path == "/auth/googleoauth/return";
    });

    expect(routeExists).to.be.ok();
  });

  it("redirects to a default URL when login was successful", function() {
    var req = new MockRequest();
    var res = new MockResponse();

    config.redirectOnSuccess = "/redir";

    adapter = oAuth2(app, config);

    adapter.redirectOnSuccess(req, res);
    expect(res.url).to.equal("/redir");
  });

  it("redirects to a url specified in the session when login was successful", function() {
    var req = new MockRequest();
    var res = new MockResponse();
    req.session.redirect = "/success";

    adapter = oAuth2(app, config);

    adapter.redirectOnSuccess(req, res);
    expect(res.url).to.equal("/success");
  });

  it("works when no session middleware", function() {
    var req = new MockRequest();
    var res = new MockResponse();

    delete req.session;

    adapter = oAuth2(app, config);

    adapter.redirectOnSuccess(req, res);
    expect(res.url).to.equal("/");
  });

  it("calls back to find the user after authentication", function(done) {
    var req = new MockRequest();
    var res = new MockResponse();
    var oAuth2 = require("../lib/adapters/googleoauth");

    var verifyCallback = function(authInfo, done) {
      done(null, {id: 123, name: "Kevin"});
    };

    adapter = oAuth2(app, {clientID: "abc", clientSecret: "def", verifyCallback: verifyCallback, baseURL: "/root"});

    adapter.callback("abc", "def", {displayName: "Kevin"}, function(err, user) {
      expect(user).to.be.ok();
      expect(user.id).to.equal(123);
      done();
    });
  });
  

});
