var passport = require('passport');
var expect = require("expect.js");
var express = require("express");

describe("Google OAuth", function() {
  var googleoAuth;
  var app;
  var adapter;
  var config;
  beforeEach(function() {
    app = express();
    googleoAuth = require("../lib/adapters/googleoauth");
    config = {
      clientID: "abc", 
      clientSecret: "def", 
      baseURL: "/",
      verifyCallback: function() {}
    };
    adapter = googleoAuth(app, config);
  });
  
  it("throws an error if app isn't specified", function() {
    var googleoAuth = require("../lib/adapters/googleoauth");

    try {
      googleoAuth(null, {clientID: "abc", clientSecret: "def"});
      expect().fail("Expected exception that wasn't thrown");
    }
    catch(e) {
      expect(e.message).to.contain("app must be specified");
    }
  });

  it("throws an error if options aren't specified", function() {
    var googleoAuth = require("../lib/adapters/googleoauth");

    try {
      googleoAuth(app);
      expect().fail("Expected exception that wasn't thrown");
    }
    catch(e) {
      expect(e.message).to.contain("options must be specified");
    }
  });

  it("throws an error if verify callback isn't specified", function() {
    var googleoAuth = require("../lib/adapters/googleoauth");

    try {
      googleoAuth(app, {clientID: "abc", clientSecret: "def", baseURL: "/"});
      expect().fail("Expected exception that wasn't thrown");
    }
    catch(e) {
      expect(e.message).to.contain("Verify callback must be specified");
    }
  });

  it("throws an error if the base URL isn't specified", function() {
    var googleoAuth = require("../lib/adapters/googleoauth");

    try {
      googleoAuth(app, {clientID: "abc", clientSecret: "def"});
      expect().fail("Expected exception that wasn't thrown");
    }
    catch(e) {
      expect(e.message).to.contain("base URL must be specified");
    }
  });

  it("sets the adapter name", function() {
    expect(adapter.name).to.equal("googleoauth");
  });

  it("sets the default scope", function() {
    expect(adapter.scope).to.equal('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile');
  });
  

  it("uses a provided oauth scope if specified", function() {
    config.scope = 'https://www.googleapis.com/auth/userinfo.email';
    adapter = googleoAuth(app, config);
    expect(adapter.scope).to.equal('https://www.googleapis.com/auth/userinfo.email');
  });

});



