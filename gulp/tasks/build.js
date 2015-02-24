var gulp = require('gulp');

gulp.task('build', ['browserify', 'stylus', 'css', 'images', 'assets', 'markup']);
