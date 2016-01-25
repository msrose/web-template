'use strict';

var gulp = require('gulp');
var cache = require('gulp-cached');
var webserver = require('gulp-server-livereload');
var sass = require('gulp-sass');
var eslint = require('gulp-eslint');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var htmlmin = require('gulp-htmlmin');
var rimraf = require('rimraf');
var babel = require('gulp-babel');

// serve the application for development
gulp.task('serve', function() {
  gulp.src('app/public')
    .pipe(webserver({
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
  'app/public/tests/**/*.js',
  '!app/public/scripts/compiled/**/*.js',
  '!app/public/tests/compiled/**/*.js'
];

var babelScripts = [
  'app/src/scripts/**/*.js'
];

var babelTests = [
  'app/src/tests/**/*.js'
];

var babelFiles = babelScripts.concat(babelTests);

// copy polyfill file from npm package to be used in browser
gulp.task('copy:polyfill', function() {
  gulp.src('node_modules/babel-polyfill/dist/polyfill.min.js')
    .pipe(gulp.dest('app/public/lib/babel-polyfill'));
});

// compile js source files with babel
gulp.task('babel:scripts', function() {
  return gulp.src(babelScripts)
    .pipe(cache('babelScripts'))
    .pipe(babel())
    .pipe(gulp.dest('app/public/scripts/compiled'));
});

// compile js test files with babel
gulp.task('babel:tests', function() {
  return gulp.src(babelTests)
    .pipe(cache('babelTests'))
    .pipe(babel())
    .pipe(gulp.dest('app/public/tests/compiled'));
});

// compile es6 features with babel
gulp.task('babel', ['babel:scripts', 'babel:tests']);

// compile with babel every time a file is changed
gulp.task('babel:watch', function() {
  gulp.watch(babelFiles, ['babel']);
});

var allJs = jsFiles.concat(babelFiles);

// lint javascript files
gulp.task('lint', function() {
  return gulp.src(allJs)
    .pipe(cache('linting'))
    .pipe(eslint())
    .pipe(eslint.format());
});

// lint javascript every time a file is changed
gulp.task('lint:watch', function() {
  gulp.watch(allJs, ['lint']);
});

// run all watch tasks
gulp.task('watch', ['sass:watch', 'babel:watch', 'lint:watch']);

// run all compilation tasks
gulp.task('compile', ['sass', 'babel']);

// remove compiled files
gulp.task('clean:compiled', function(done) {
  rimraf('app/public/*/compiled', done);
});

// build for production: concatenate, minify
gulp.task('build', ['clean', 'compile'], function() {
  return gulp.src(['app/public/*[!lib]*/*.html', 'app/public/*.html'])
    .pipe(useref())
    .pipe(gulpif(['*.js', '!vendor.js'], uglify()))
    .pipe(gulpif('*.css', autoprefixer()))
    .pipe(gulpif('*.css', cssnano()))
    .pipe(gulpif('*.html', htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest('app/dist'));
});

// test production build in the browser
gulp.task('serve:dist', ['build'], function() {
  gulp.src('app/dist')
    .pipe(webserver({
      livereload: false,
      port: 1338,
      open: true
    }));
});

// remove built files
gulp.task('clean:dist', function(done) {
  rimraf('app/dist', done);
});

// remove all generated files
gulp.task('clean', ['clean:compiled', 'clean:dist']);

gulp.task('default', ['lint', 'compile', 'watch', 'serve']);
