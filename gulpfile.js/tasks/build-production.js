var gulp         = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('copyCNAME', function() {
  return gulp.src('./CNAME')
    .pipe(gulp.dest('./public'));
});

gulp.task('build:production', function(cb) {
  process.env.NODE_ENV = 'production'
  gulpSequence('clean', ['fonts', 'iconFont', 'images'], ['stylus', 'webpack:production'], 'html', 'rev', 'copyCNAME', cb);
});
