var gulp = require('gulp');

gulp.task('build', ['browserify', 'stylus', 'sass', 'css', 'images', 'assets', 'markup']);
