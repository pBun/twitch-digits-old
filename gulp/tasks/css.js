var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var gulpif = require('gulp-if');
var minifycss = require('gulp-minify-css');
var config = require('../config');
var cssConfig = config.css;

gulp.task('css', function() {
  return gulp.src(cssConfig.src)
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(gulpif(global.isProduction, minifycss()))
    .pipe(gulp.dest(cssConfig.dest));
});
