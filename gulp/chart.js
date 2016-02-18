'use strict';

var gulp = require('gulp');

gulp.task('chart', function () {
  return gulp.src('./bower_components/charting_library/charting_library/static/**').pipe(gulp.dest('./.tmp/serve/charting_library/static'));
});
