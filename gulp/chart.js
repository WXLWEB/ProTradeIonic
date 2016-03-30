'use strict';

var gulp = require('gulp');

gulp.task('chart', function () {
  return gulp.src('./bower_components/charting_library/charting_library/static/**').pipe(gulp.dest('./.tmp/charting_library/static'));
});
gulp.task('chart:build', function () {
  return gulp.src('./bower_components/charting_library/charting_library/static/**').pipe(gulp.dest('./www/charting_library/static'));
});
