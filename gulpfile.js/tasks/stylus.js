var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var stylus = require('gulp-stylus');
var sourcemaps   = require('gulp-sourcemaps');
var handleErrors = require('../lib/handleErrors');
var config       = require('../config/stylus');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('stylus', function () {
  return gulp.src(config.src)
    .pipe(sourcemaps.init())
    .pipe(stylus(config.settings))
    .on('error', handleErrors)
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}));
});
