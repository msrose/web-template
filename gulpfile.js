'use strict';

var gulp = require('gulp');
var livereload = require('gulp-server-livereload');
var sass = require('gulp-sass');
var eslint = require('gulp-eslint');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var htmlmin = require('gulp-htmlmin');
var serve = require('gulp-serve');
var rimraf = require('rimraf');

gulp.task('serve', function() {
  gulp.src('app/public')
    .pipe(livereload({
      livereload: true,
      port: 1337,
      open: true
    }));
});

var sassFiles = 'app/src/sass/**/*.scss';

gulp.task('sass', function() {
  gulp.src(sassFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/public/styles/compiled'));
});

gulp.task('sass:watch', function() {
  gulp.watch(sassFiles, ['sass']);
});

var jsFiles = [
  'gulpfile.js',
  'app/public/scripts/**/*.js',
  'app/src/tests/**/*.js'
];

gulp.task('eslint', function() {
  return gulp.src(jsFiles)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('eslint:watch', function() {
  gulp.watch(jsFiles, ['eslint']);
});

gulp.task('build', ['sass'], function() {
  return gulp.src(['app/public/*[!lib]*/*.html', 'app/public/*.html'])
    .pipe(useref())
    .pipe(gulpif(['*.js', '!vendor.js'], uglify()))
    .pipe(gulpif('*.css', cssnano()))
    .pipe(gulpif('*.html', htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest('app/dist'));
});

gulp.task('clean', function(done) {
  rimraf('app/dist', done);
});

gulp.task('serve:dist', ['build'], serve({
  root: 'app/dist',
  port: 1338
}));

gulp.task('default', [
  'eslint',
  'sass',
  'eslint:watch',
  'sass:watch',
  'serve'
]);
