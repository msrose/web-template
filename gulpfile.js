'use strict';

var gulp = require('gulp');
var webserver = require('gulp-server-livereload');
var sass = require('gulp-sass');

gulp.task('serve', function() {
  gulp.src('app/public')
    .pipe(webserver({
      livereload: true,
      port: 1337,
      open: true
    }));
});

gulp.task('sass', function() {
  gulp.src('app/src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/public/styles/compiled'));
});

gulp.task('sass:watch', function() {
  gulp.watch('app/src/sass/**/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'sass:watch', 'serve']);
