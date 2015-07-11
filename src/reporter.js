var notify = require('gulp-notify');
var gutil = require('gulp-util');
var combine = require('stream-combiner2');
var path = require('path');
var util = require('util');
var extend = util._extend;

var defaults = {
	options: {
		icon: path.join(__dirname, 'reporters', 'assets', 'gulp-error.png')
	},
	formatter: function(file, errors) {
		var title = file.relative;
		if (errors.length > 1) {
			title += ' (' + errors.length + ' errors)';
		}

		return {
			title: title,
			message: errors.join('\n')
		};
	}
};

var report = function(reporter, options) {
	options = extend(extend({}, defaults.options), options);
	if (reporter.icon) {
		options.icon = reporter.icon;
	}

	return notify(function(file) {
		var errors = reporter(file);
		if (errors.length < 1) {
			return;
		}

		if (reporter.formatter) {
			return extend(options, reporter.formatter(file, errors));
		} else {
			return extend(options, defaults.formatter(file, errors));
		}
	});
};

module.exports = function(reporterName, options) {
	var reporter = null;
	if (util.isString(reporterName)) {
		try {
			reporter = require('./reporters/' + reporterName);
		} catch (e) {
			throw new gutil.PluginError({
				plugin: 'gulp-notify-linter-reporters',
				message: '\'' + reporterName + '\' reporter cannot be found.'
			});
		}
	} else if (util.isFunction(reporterName)) {
		reporter = reporterName;
	} else {
		options = reporterName;
	}

	if (reporter) {
		return report(reporter, options);
	} else {
		var reporters = path.join(__dirname, 'reporters');
		reporters = require('fs').readdirSync(reporters).filter(function(file) {
			return path.extname(file) === '.js';
		});

		var reports = reporters.map(function(file) {
			return report(require('./reporters/' + file), options);
		});

		return combine.apply(combine, reports);
	}
};
