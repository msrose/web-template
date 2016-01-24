'use strict';

var gulp = require('gulp');
var cache = require('gulp-cached');
var livereload = require('gulp-server-livereload');
var sass = require('gulp-sass');
var eslint = require('gulp-eslint');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var htmlmin = require('gulp-htmlmin');
var serve = require('gulp-serve');
var rimraf = require('rimraf');

// serve the application for development
gulp.task('serve', function() {
  gulp.src('app/public')
    .pipe(livereload({
      livereload: true,
      port: 1337,
      open: true
    }));
});

var sassFiles = 'app/src/sass/**/*.scss';

// compile sass files to css
gulp.task('sass', function() {
  gulp.src(sassFiles)
    .pipe(cache('sass'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/public/styles/compiled'));
});

// recompile sass when a file is changed
gulp.task('sass:watch', function() {
  gulp.watch(sassFiles, ['sass']);
});

var jsFiles = [
  'gulpfile.js',
  'app/public/scripts/**/*.js',
  'app/src/tests/**/*.js'
];

// lint javascript files
gulp.task('lint', function() {
  return gulp.src(jsFiles)
    .pipe(cache('linting'))
    .pipe(eslint())
    .pipe(eslint.format());
});

// lint javascript every time a file is changed
gulp.task('lint:watch', function() {
  gulp.watch(jsFiles, ['lint']);
});

// build for production: concatenate, minify
gulp.task('build', ['sass'], function() {
  return gulp.src(['app/public/*[!lib]*/*.html', 'app/public/*.html'])
    .pipe(useref())
    .pipe(gulpif(['*.js', '!vendor.js'], uglify()))
    .pipe(gulpif('*.css', autoprefixer()))
    .pipe(gulpif('*.css', cssnano()))
    .pipe(gulpif('*.html', htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest('app/dist'));
});

// test production build in the browser
gulp.task('serve:dist', ['build'], serve({
  root: 'app/dist',
  port: 1338
}));

// remove built files
gulp.task('clean', function(done) {
  rimraf('app/dist', done);
});

gulp.task('default', [
  'lint',
  'sass',
  'lint:watch',
  'sass:watch',
  'serve'
]);
