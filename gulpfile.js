'use strict';

var gulp = require('gulp');
var serve = require('gulp-serve');

gulp.task('serve', serve({
  root: 'app/public',
  port: 1337
}));

gulp.task('default', ['serve']);
