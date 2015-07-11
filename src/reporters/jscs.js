var path = require('path');

module.exports = function(file) {
	if (!file.jscs || file.jscs.success) {
		return [];
	}

	return file.jscs.errors.map(function(error) {
		return error.line + ':' + error.column + '  ' + error.message;
	});
};

module.exports.icon = path.join(__dirname, 'assets', 'jscs.png');
