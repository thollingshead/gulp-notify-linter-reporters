var notify = require('gulp-notify');
var combine = require('stream-combiner2');
var path = require('path');
var extend = require('util')._extend;
var clone = function(obj) {
	return extend({}, obj);
};

var formatReport = function(file, errors, options) {
	options.message = errors.join('\n');

	options.title = file.relative;
	if (errors.length > 1) {
		options.title += ' (' + errors.length + ' errors)';
	}

	return options;
};

var jscs = function(options) {
	options = clone(options);
	options.icon = path.join(__dirname, 'assets', 'jscs.png');

	return notify(function(file) {
		if (!file.jscs || file.jscs.success) {
			return;
		}

		var errors = file.jscs.errors.map(function(error) {
			return error.line + ':' + error.column + '  ' + error.message;
		});
		return formatReport(file, errors, options);
	});
};

var jshint = function(options) {
	options = clone(options);
	options.icon = path.join(__dirname, 'assets', 'jshint.png');

	return notify(function(file) {
		if (!file.jshint || file.jshint.success) {
			return;
		}

		var errors = [];
		file.jshint.results.forEach(function(data) {
			if (data.error) {
				var error = data.error;
				errors.push(error.line + ':' + error.character + '  ' + error.reason);
			}
		});
		return formatReport(file, errors, options);
	});
};

var all = function(options) {
	return combine(jscs(options), jshint(options));
};

module.exports = all;
module.exports.jscs = jscs;
module.exports.jshint = jshint;
