var expect = require("expect.js");
describe("Initialization", function() {
  var app;
  var expresslane;
  beforeEach(function() {
    app = require("express")();
    expresslane = require("../");
  });

  it("requires an app", function() {
    try {
      expresslane(null, {});
      expect.fail("No error thrown when app not specified");
    } catch(err) {
      expect(err.message).to.contain("app");
    }
    
  });
  
  it("requires options", function() {
    try {
      expresslane(app, null);
      expect.fail("No error thrown when configuration not specified");
    } catch(err) {
      expect(err.message).to.contain("Configuration");
    }
    
  });

  it("throws on invalid adapter", function() {
    var config = {
      blahblahauth: {
      }
    };

    try {
      expresslane(app, config);
      expect.fail("No error thrown when invalid adapter is specified");
    } catch(err) {
      expect(err.message).to.contain("adapter");
    }
  });

  it("wires up a single adapter", function() {
    var config = {
      googleoauth: {
        clientID: "xxx",
        clientSecret: "yyy",
        baseURL: "http://my.site.com",
        verifyCallback: function() {}
      }
    };

    var expresslaneApp =  expresslane(app, config);

    expect(expresslaneApp).to.be.ok();
    expect(expresslaneApp.adapters.length).to.equal(1);
    expect(expresslaneApp.adapters[0].options.clientID).to.equal(config.googleoauth.clientID);
  });

  it("wires up a multiple adapters", function() {
    var config = {
      googleoauth: {
        clientID: "xxx",
        clientSecret: "yyy",
        baseURL: "http://my.site.com",
        verifyCallback: function() {}
      },
      facebookoauth: {
        clientID: "xxx",
        clientSecret: "yyy",
        baseURL: "http://my.site.com",
        verifyCallback: function() {}
      }
    };

    var expresslaneApp =  expresslane(app, config);

    expect(expresslaneApp).to.be.ok();
    expect(expresslaneApp.adapters.length).to.equal(2);
    expect(expresslaneApp.adapters[1].options.clientID).to.equal(config.facebookoauth.clientID);
  });
  
  it("registers the logout route", function() {
    var config = {
      googleoauth: {
        clientID: "xxx",
        clientSecret: "yyy",
        baseURL: "http://my.site.com",
        verifyCallback: function() {}
      }
    };

    var expresslaneApp =  expresslane(app, config);

    var routeExists = app.routes.get.some(function(route) {
      return route.path == "/logout";
    });

    expect(routeExists).to.be.ok();
  });
  
});

