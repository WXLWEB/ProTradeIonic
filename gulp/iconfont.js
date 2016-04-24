'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

// generate iconfont
gulp.task('iconfont', function(){
 return gulp.src('app/icons/*.svg', {
       buffer: false
   })
   .pipe($.iconfontCss({
     fontName: 'ownIconFont',
     path: 'app/icons/own-icons-template.css',
     targetPath: '../styles/own-icons.css',
     fontPath: '../fonts/'
   }))
   .pipe($.iconfont({
       fontName: 'ownIconFont'
   }))
   .pipe(gulp.dest(path.join(conf.paths.tmp, 'fonts')));
});
