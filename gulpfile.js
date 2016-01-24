'use strict';

var gulp = require('gulp');
var serve = require('gulp-serve');
var sass = require('gulp-sass');

gulp.task('serve', serve({
  root: 'app/public',
  port: 1337
}));

gulp.task('sass', function() {
  gulp.src('app/src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/public/styles/compiled'));
});

gulp.task('sass:watch', function() {
  gulp.watch('app/src/sass/**/*.scss', ['sass']);
});

gulp.task('default', ['serve', 'sass', 'sass:watch']);
