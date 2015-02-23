var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var gulpif = require('gulp-if');
var minifycss = require('gulp-minify-css');
var handleErrors = require('../util/handleErrors');
var config = require('../config');
var sassConfig = require('../config').sass;

gulp.task('sass', ['images'], function() {
  return gulp.src(sassConfig.src)
    .pipe(sourcemaps.init())
    .pipe(sass(sassConfig.settings))
    .on('error', handleErrors)
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(gulpif(global.isProduction, minifycss()))
    .pipe(gulp.dest(sassConfig.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
