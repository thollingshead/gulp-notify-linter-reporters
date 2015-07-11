var notify = require('gulp-notify');
var path = require('path');
var extend = require('util')._extend;
var clone = function(obj) {
	return extend({}, obj);
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
		options.message = errors.join('\n');

		options.title = file.relative;
		if (errors.length > 1) {
			options.title += ' (' + errors.length + ' errors)';
		}

		return options;
	});
};

var all = function(options) {
	return jscs(options);
};

module.exports = all;
module.exports.jscs = jscs;
