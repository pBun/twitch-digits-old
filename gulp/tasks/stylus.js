var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var stylus = require('gulp-stylus');
var gulpif = require('gulp-if');
var minifycss = require('gulp-minify-css');
var handleErrors = require('../util/handleErrors');
var config = require('../config');
var stylConfig = config.stylus;

gulp.task('stylus', function () {
  return gulp.src(stylConfig.src)
    .pipe(stylus({set: ['compress']}))
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(gulpif(global.isProduction, minifycss()))
    .on('error', handleErrors)
    .pipe(gulp.dest(stylConfig.dest))
});
