/// <reference path="../typings/node/node.d.ts"/>
var test = require("tapef");
var r = require("../");
var rr = r._resolveRoute;
var pathResolve = require("path").resolve;
var configuration = {
	"modelsPath" : "/app/library/models",
	"defaultModels": "library/models",
	"models": {
		"user": "library/models/user.js"
	}
};
var r2 = require("../")(configuration);

test("rr must be function", function (t) {
	t.equal(typeof rr, "function");
	t.end();
});

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

test("multiple env variables", function (t) {
	process.env["a"] = "A";
	process.env["b"] = "B";
	t.equal(rr("./{%a%}.{%b}.js"), "./A.B.js");
	t.end();
});

test("from config 1", function (t) {
	var userModelPath = r2._resolveRoute("#modelsPath/user.js");
	t.equal(userModelPath, "/app/library/models/user.js");
	t.end();
});

test("from config 2", function (t) {
	var userModelPath = r2._resolveRoute("/app/{#defaultModels}/user.js");
	t.equal(userModelPath, "/app/library/models/user.js");
	t.end();
});

test("from config 3", function (t) {
	var userModelPath = r2._resolveRoute("/app/{#models.user}");
	t.equal(userModelPath, "/app/library/models/user.js");
	t.end();
});

test("nested", function (t) {
	process.env["a"] = "user";
	var userModelPath = r2._resolveRoute("/app/{#models.{%a}}");
	t.equal(userModelPath, "/app/library/models/user.js");
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
