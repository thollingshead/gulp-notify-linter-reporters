# gulp-notify-linter-reporters
A Node.js module for reporting lint errors via notifications on Mac, Windows, and Linux.

## Install

```
$ npm install --save-dev gulp-notify-linter-reporters
```

## Usage

Setup a `gulpfile.js` with some linters:

```JavaScript
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

gulp.task('default', function() {
	return gulp.src('**/*.js')
		.pipe(jshint())
		.pipe(jscs());
});

```

### Reporting all linting errors together
```JavaScript
var notifyLinterReporter = require('gulp-notify-linter-reporter');
...
gulp.task('default', function() {
	return gulp.src('**/*.js')
		.pipe(jshint())
		.pipe(jscs());
		.pipe(notifyLinterReporter())
});

```

### Reporting specific linting errors

```JavaScript
var notifyLinterReporter = require('gulp-notify-linter-reporter');
...
gulp.task('default', function() {
	return gulp.src('**/*.js')
		.pipe(jshint())
		.pipe(jscs());
		.pipe(notifyLinterReporter('jscs'))
});

```

### Using a custom reporter

```JavaScript
var notifyLinterReporter = require('gulp-notify-linter-reporter');
var myJSHintReporter = require(./my-jshint-reporter);
...
gulp.task('default', function() {
	return gulp.src('**/*.js')
		.pipe(jshint())
		.pipe(notifyLinterReporter(myJSHintReporter, options))
});

```

## API

### notifyLinterReporter(String, *options)

Only report errors using the specified reporter. Available reporters: `'jscs'`, `'jshint'`.

### notifyLinterReporter(Function, *options)

Use a custom reporter. See [how to write a custom reporter](#writing-a-custom-reporter).

### notifyLinterReporter(*options)

Use all of the reporters. See [node-notifier][github-node-notifier] for all options.

## Writing a custom reporter

A custom reporter is a function that returns an array of messages:

```JavaScript
// Custom reporter
function reporter(files) {
	var errors = files.map(function(file) {
		return file.error.message;
	});

	return errors.filter(function(message) {
		return message.length > 0;
	});
}
module.exports = reporter;
```

Additionally, the reporter may specify a custom icon:
```JavaScript
module.exports.icon = path.join(__dirname, 'myerror.png');
```

The reporter can also specify a custom message format using a formatter function. The formatter returns an `Object` containing a title and/or a message.

```JavaScript
function formatter(file, errors) {
	return {
		title: 'Something is wrong in: ' + file.relative,
		message: 'There are ' + errors.length + ' errors.'
	};
}
```

Special thanks to [Mikael Brevik][mikaelbr] and his excellent [gulp-notify][github-gulp-notify]

[github-node-notifier]: https://github.com/mikaelbr/node-notifier
[mikaelbr]: https://github.com/mikaelbr
[github-gulp-notify]: https://github.com/mikaelbr/gulp-notify
