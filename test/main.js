/// <reference path="../typings/node/node.d.ts"/>
var test = require("tapef");
var r = require("../");
var rr = r.resolve;
var pathResolve = require("path").resolve;
var dirname = require("path").dirname;
var pathjoin = require("path").join;

test("rr must be function", function(t) {
	t.equal(typeof rr, "function");
	t.end();
});

test("current working directory", function(t) {
	t.equal(rr(">/a.js"), pathResolve(process.cwd(), "a.js"));
	t.equal(rr(">a.js"), pathResolve(process.cwd(), "a.js"));
	t.end();
});

test("single env variable", function(t) {
	process.env["DUMMY"] = "model";
	t.equal(rr("./{%DUMMY%}.js"), "./model.js");
	t.end();
});

test("multiple env variables", function(t) {
	process.env["a"] = "A";
	process.env["b"] = "B";
	t.equal(rr("./{%a%}.{%b}.js"), "./A.B.js");
	t.end();
});

test("project home", function(t) {
	var pkgDir = dirname(__dirname);
	t.equal(rr("~/a/b/c.js"), pathjoin(pkgDir, "a/b/c.js"));
	t.end();
});
