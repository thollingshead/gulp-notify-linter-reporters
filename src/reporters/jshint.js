var path = require('path');

module.exports = function(file) {
	if (!file.jshint || file.jshint.success) {
		return [];
	}

	var errors = [];
	file.jshint.results.forEach(function(data) {
		if (data.error) {
			var error = data.error;
			errors.push(error.line + ':' + error.character + '  ' + error.reason);
		}
	});
	return errors;
};

module.exports.icon = path.join(__dirname, 'assets', 'jshint.png');
