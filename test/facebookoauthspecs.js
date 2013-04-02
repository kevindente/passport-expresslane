var passport = require('passport');
var expect = require("expect.js");
var express = require("express");

describe("Facebook OAuth", function() {
  var facebookoAuth;
  var app;
  var adapter;
  var config;
  beforeEach(function() {
    app = express();
    facebookoAuth = require("../lib/adapters/facebookoauth");
    config = {
      clientID: "abc", 
      clientSecret: "def", 
      baseURL: "/",
      verifyCallback: function() {}
    };
    adapter = facebookoAuth(app, config);
  });
  
  it("throws an error if app isn't specified", function() {
    var facebookoAuth = require("../lib/adapters/facebookoauth");

    try {
      facebookoAuth(null, {clientID: "abc", clientSecret: "def"});
      expect().fail("Expected exception that wasn't thrown");
    }
    catch(e) {
      expect(e.message).to.contain("app must be specified");
    }
  });

  it("throws an error if options aren't specified", function() {
    var facebookoAuth = require("../lib/adapters/facebookoauth");

    try {
      facebookoAuth(app);
      expect().fail("Expected exception that wasn't thrown");
    }
    catch(e) {
      expect(e.message).to.contain("options must be specified");
    }
  });

  it("throws an error if verify callback isn't specified", function() {
    var facebookoAuth = require("../lib/adapters/facebookoauth");

    try {
    }
    catch(e) {
      expect(e.message).to.contain("Verify callback must be specified");
    }
  });

  it("throws an error if the base URL isn't specified", function() {
    var facebookoAuth = require("../lib/adapters/facebookoauth");

    try {
      facebookoAuth(app, {clientID: "abc", clientSecret: "def"});
      expect().fail("Expected exception that wasn't thrown");
    }
    catch(e) {
      expect(e.message).to.contain("base URL must be specified");
    }
  });

  it("sets the adapter name", function() {
    expect(adapter.name).to.equal("facebookoauth");
  });

  it("sets the default scope", function() {
    expect(adapter.scope).to.equal('email');
  });
  

  it("uses a provided oauth scope if specified", function() {
    config.scope = 'anotherscope';
    adapter = facebookoAuth(app, config);
    expect(adapter.scope).to.equal('anotherscope');
  });

});

