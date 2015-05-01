var test = require("tapef");
var r = require("../");
var rr = r._resolveRoute;
var pathResolve = require("path").resolve;

test("current working directory", function (t) {
	t.equal(rr(">/a.js"), pathResolve(process.cwd(), "a.js"));
	t.equal(rr(">a.js"), pathResolve(process.cwd(), "a.js"));
	t.end();
});


test("single env variable", function (t) {
	process.env["DUMMY"] = "model";
	t.equal(rr("./{%DUMMY%}.js"), "./model.js");
	t.end();
});

//test("set massive config value", function (t) {
//	r("#", {a: {b: {c: 1}}});
//	r("#set", "path", 42);
//	r("#path", 42);
//	t.end();
//});
//
//test("remove value from config", function (t) {
//	r("#rm", "path");
//	t.end();
//});
//
//
//test("get config value", function (t) {
//	t.equal("c", r("#a.b.c"));
//	t.end();
//});
