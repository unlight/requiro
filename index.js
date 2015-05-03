/// <reference path="typings/node/node.d.ts"/>
"use strict";
var assert = require("assert").ok;
var join = require("path").join;
var isString = require("util").isString || function isString(arg) {
	return typeof arg === "string";
};
var isObject = require("util").isObject || function isObject(arg) {
	return typeof arg === "object" && arg !== null;
};
var getvalue = require("getvaluer");
var setvalue = require("setvaluer");
var merge = require("deepmerge");
//var stackTrace = require("stack-trace");
//var dirname = require("path").dirname;
//var fs = require("fs");

function currentWorkingDirectory(path) {
	var result = join(process.cwd(), path);
	return result;
}

var variableParsers = {
	"%": function(path, name, nStart, nEnd) {
		if (name.slice(-1) === "%") {
			name = name.slice(0, -1);
		}
		var result = process.env[name];
		return result;
	},
	"#": function(path, name, nStart, nEnd) {
		var result = config(name);
		return result;
	}
};

function setVariables(path, position) {
	if (position === undefined) {
		position = 0;
	}
	var nStart = path.indexOf("{", position);
	var nEnd = path.lastIndexOf("}");
	if (nStart !== -1 && nEnd !== -1) {
		var nStart1 = nStart + 1;
		var part = path.substring(nStart1, nEnd);
		var st = part.indexOf("{");
		var pe = part.lastIndexOf("}");
		if (st < pe) {
			part = setVariables(part, position);
		} else if (st > pe) {
			nEnd = pe + nStart1;
			part = part.slice(0, pe);
		}
		var symbol = part.slice(0, 1);
		var parser = variableParsers[symbol];
		if (!parser) {
			throw new Error("Unsupported syntax.");
		}
		var value = parser(path, part.slice(1), nStart, nEnd);
		if (value != null) {
			path = path.slice(0, nStart) + value + path.slice(nEnd + 1);
		}
		path = setVariables(path, nStart1);
	}
	return path;
}


function resolveRoute(path) {
	var char1 = path.slice(0, 1);
	var char2 = path.slice(0, 2);
	if (char1 === ">") {
		path = currentWorkingDirectory(path.slice(1));
	}
	else if (char2 === ">/") {
		path = currentWorkingDirectory(path.slice(2));
	}
	else if (char1 === "#") {
		var nPos1 = path.indexOf("/");
		var name = path.slice(1, nPos1);
		path = config(name) + path.slice(nPos1);
	}
	
	//	else if (char1 === ":") {
	//		throw "Not supported";
	//		var trace = stackTrace.get(api);
	//		var fromFile = trace[0].getFileName();
	//		var fromDirectory = dirname(fromFile);
	//	} else if (char2 === "~/") {
	//		throw "Not supported";
	//		path = projectHome(path.slice(2));
	//	} else if (char2 === "//") {
	//		throw "Not supported";
	//	} else if (char2 === "/*") {
	//		throw "Not supported";
	//	}
	path = setVariables(path);
	return path;
}

var configuration = {};

function config(name, value) {
	if (name === "" && isObject(value)) {
		var collection = value;
		for (var key in collection) {
			if (!collection.hasOwnProperty(key)) continue;
			setvalue(key, collection[key]);
		}
	} else if (isString(name)) {
		if (value !== undefined) {
			//configurationData[name] = value;
			setvalue();
			throw "Not supported.";
		}
		var result = getvalue(name, configuration);
		return result;
	} else {
		throw TypeError("Unknown error.");
	}
}

function api1(path) {
	assert(isString(path), "Path must be a string.");
	path = resolveRoute(path);
	var result = require(path);
	return result;
}

api1._resolveRoute = resolveRoute;

function api2(data) {
	configuration = merge(configuration, data);
	return api1;
}

function api(data) {
	if (isObject(data) || arguments.length === 0) {
		return api2(data);
	}
	return api1(data);
}

module.exports = api;
module.exports._resolveRoute = resolveRoute;