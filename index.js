/// <reference path="typings/node/node.d.ts"/>
"use strict";
var assert = require("assert").ok;
var join = require("path").join;
//var dirname = require("path").dirname;
//var fs = require("fs");
var isString = require("util").isString || function isString(arg) {
	return typeof arg === "string";
};
//var isObject = require("util").isObject || function isObject(arg) {
//	return typeof arg === "object" && arg !== null;
//};
//var stackTrace = require("stack-trace");
//var getvalue = require("getvaluer");

function currentWorkingDirectory(path) {
	var result = join(process.cwd(), path);
	return result;
}

//function projectHome(path) {
//	throw "Not supported";
//	// What is project home?
//	return path;
//}

function setEnvironmentVariables(path) {
	var nPos1 = path.indexOf("{%");
	if (nPos1 !== -1) {
		var nPos2 = path.indexOf("}", nPos1);
		var name = path.substring(nPos1 + 2, nPos2);
		if (name.slice(-1) === "%") {
			name = name.slice(0, -1);
		}
		var value = process.env[name];
		if (value !== undefined) {
			path = path.slice(0, nPos1) + value + path.slice(nPos2 + 1);
		}
		// TODO: Uncomment if serveral env vars needed.
		// nPos1 = path.indexOf("{%");
	}
	return path;
}

function resolveRoute(path) {
	assert(isString(path), "path must be a string");
	var char1 = path.slice(0, 1);
	var char2 = path.slice(0, 2);
	if (char1 === ">") {
		path = currentWorkingDirectory(path.slice(1));
	} else if (char2 === ">/") {
		path = currentWorkingDirectory(path.slice(2));
	} 
//	else if (char1 === "#") {
//		var value = arguments[1];
//		var name = path.slice(1);
//		return configuration(name, value);
//	}
	
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
	path = setEnvironmentVariables(path);
	return path;
}

//var configurationData = {};

//function configuration(name, value) {
//	if (name === "" && isObject(value)) {
//		var collection = value;
//		for (var key in collection) {
//			if (!collection.hasOwnProperty(key)) continue;
//			setvalue(key, collection[key]);
//		}
//	} else if (isString(name)) {
//		if (value !== undefined) {
//			//configurationData[name] = value;
//			setvalue();
//			throw "Not supported.";			
//		}
//		var result = getvalue(name, configurationData);
//		return result;		
//	} else {
//		throw TypeError("Unknown error.");
//	}
//}

function api(path) {
	path = resolveRoute(path);
	var result = require(path);
	return result;
}

module.exports = api;
module.exports._resolveRoute = resolveRoute;
 