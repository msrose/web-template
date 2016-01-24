'use strict';

var gulp = require('gulp');
var webserver = require('gulp-server-livereload');
var sass = require('gulp-sass');
var eslint = require('gulp-eslint');
var KarmaServer = require('karma').Server;

gulp.task('serve', function() {
  gulp.src('app/public')
    .pipe(webserver({
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

gulp.task('test', function(done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('default', [
  'eslint',
  'sass',
  'eslint:watch',
  'sass:watch',
  'serve'
]);
