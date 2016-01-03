var test = require("tapef");
var r = require("../");
var rr = r.resolve;
var pathResolve = require("path").resolve;
var dirname = require("path").dirname;
var pathjoin = require("path").join;
var path = require("path");

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

test("package root", function(t) {
	var a1 = require(__dirname + "/fixtures/package_root/a/1");
	t.equal(a1, "b");
	t.end();
});

test("explicit package root", function(t) {
	var filedir = __dirname + "/fixtures/package_root/a";
	var result = rr("~/b", {filedir: filedir, relative: true});
	t.equal(result, ".." + path.sep + "b");
	t.end();
});

test("project root", function(t) {
	var projectRoot = rr("//a");
	t.ok(projectRoot);
	t.end();
});
