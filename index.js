"use strict";
var assert = require("assert").ok;
var join = require("path").join;
var isString = require("util").isString;
var pathjoin = require("path").join;
var dirname = require("path").dirname;
var appRootDir = require("app-root-dir");
var stackTrace = require("stack-trace");
var pkgUp = require("pkg-up");

function currentWorkingDirectory(path) {
	var result = join(process.cwd(), path);
	return result;
}

var variableParsers = {
	"%": function(path, name) {
		if (name.slice(-1) === "%") {
			name = name.slice(0, -1);
		}
		var result = process.env[name];
		return result;
	}
};


var _appRootDirectory;

function appRootDirectory(path) {
	if (!_appRootDirectory) {
		_appRootDirectory = appRootDir.get();
	}
	return pathjoin(_appRootDirectory, path);
}

var _packageDirectory = {};

function packageDirectory(path, options) {
	if (!options) options = {};
	if (!_packageDirectory[path]) {
		var filedir = options.filedir;
		if (!filedir) {
			var trace = stackTrace.get();
			var filename;
			var index = 1;
			do {
				var testFilename = trace[index++].getFileName();
				if (testFilename !== __filename) {
					filename = testFilename;
				}
			} while (!filename);
			filedir = dirname(filename);
		}
		var pkgDirectory = dirname(pkgUp.sync(filedir));
		_packageDirectory[path] = pkgDirectory;
	}
	return pathjoin(_packageDirectory[path], path);
}

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

function resolve(path, options) {
	var char1 = path.slice(0, 1);
	var char2 = path.slice(0, 2);
	if (char1 === ">") {
		path = currentWorkingDirectory(path.slice(1));
	} else if (char2 === ">/") {
		path = currentWorkingDirectory(path.slice(2));
	} else if (char2 === "~/") {
		path = packageDirectory(path.slice(2), options);
	} else if (char2 === "//") {
		path = appRootDirectory(path.slice(2));
	}
	path = setVariables(path);
	return path;
}

module.exports = function(path) {
	assert(isString(path), "Path must be a string.");
	path = resolve(path);
	return require(path);
};
module.exports.resolve = resolve;