var gulp = require('gulp');

gulp.task('setProduction', function() {
  global.isProduction = true;
});

gulp.task('productionBuild', ['clean'], function() {
  gulp.start('build');
});

gulp.task('production', ['setProduction', 'productionBuild', 'connect']);
