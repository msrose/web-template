import gulp from 'gulp';
import cache from 'gulp-cached';
import webserver from 'gulp-server-livereload';
import sass from 'gulp-sass';
import sasslint from 'gulp-sass-lint';
import eslint from 'gulp-eslint';
import useref from 'gulp-useref';
import gulpif from 'gulp-if';
import uglify from 'gulp-uglify';
import autoprefixer from 'gulp-autoprefixer';
import cssnano from 'gulp-cssnano';
import htmlmin from 'gulp-htmlmin';
import babel from 'gulp-babel';
import rimraf from 'rimraf';
import runSequence from 'run-sequence';

// serve the application for development
gulp.task('serve', ['compile'], () => {
  gulp.src('app/public')
    .pipe(webserver({
      livereload: true,
      port: 1337,
      open: true
    }));
});

var sassFiles = 'app/src/sass/**/*.scss';

// compile sass files to css
gulp.task('sass', () => {
  return gulp.src(sassFiles)
    .pipe(cache('sass'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/public/styles/compiled'));
});

// recompile sass when a file is changed
gulp.task('sass:watch', () => {
  gulp.watch(sassFiles, ['sass']);
});

// lint sass files
gulp.task('sass:lint', () => {
  return gulp.src(sassFiles)
    .pipe(cache('sasslint'))
    .pipe(sasslint())
    .pipe(sasslint.format());
});

// lint whenever a sass file is changed
gulp.task('sass:lint:watch', () => {
  gulp.watch(sassFiles, ['sass:lint']);
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
gulp.task('copy:polyfill', () => {
  return gulp.src('node_modules/babel-polyfill/dist/polyfill.min.js')
    .pipe(gulp.dest('app/public/lib/babel-polyfill'));
});

// compile js source files with babel
gulp.task('babel:scripts', () => {
  return gulp.src(babelScripts)
    .pipe(cache('babelScripts'))
    .pipe(babel())
    .pipe(gulp.dest('app/public/scripts/compiled'));
});

// compile js test files with babel
gulp.task('babel:tests', () => {
  return gulp.src(babelTests)
    .pipe(cache('babelTests'))
    .pipe(babel())
    .pipe(gulp.dest('app/public/tests/compiled'));
});

// compile es6 features with babel
gulp.task('babel', ['babel:scripts', 'babel:tests']);

// compile with babel every time a file is changed
gulp.task('babel:watch', () => {
  gulp.watch(babelFiles, ['babel']);
});

var allJs = jsFiles.concat(babelFiles);

// lint javascript files
gulp.task('js:lint', () => {
  return gulp.src(allJs)
    .pipe(cache('linting'))
    .pipe(eslint())
    .pipe(eslint.format());
});

// lint javascript when a file is changed
gulp.task('js:lint:watch', () => {
  gulp.watch(allJs, ['js:lint']);
});

// run all lint tasks
gulp.task('lint', ['sass:lint', 'js:lint']);

// lint every time a file is changed
gulp.task('lint:watch', ['js:lint:watch', 'sass:lint:watch']);

// run all watch tasks
gulp.task('watch', ['sass:watch', 'babel:watch', 'lint:watch']);

// run all compilation tasks
gulp.task('compile', ['sass', 'babel']);

// remove compiled files
gulp.task('clean:compiled', (done) => {
  rimraf('app/public/*/compiled', done);
});

// build for production: concatenate, minify
gulp.task('build', (done) => {
  runSequence('clean', 'compile', () => {
    gulp.src(['app/public/*[!lib]*/*.html', 'app/public/*.html'])
      .pipe(useref())
      .pipe(gulpif(['*.js', '!vendor/*.js'], uglify()))
      .pipe(gulpif(['*.css', '!vendor/*.css'], autoprefixer()))
      .pipe(gulpif(['*.css', '!vendor/*.css'], cssnano()))
      .pipe(gulpif('*.html', htmlmin({ collapseWhitespace: true })))
      .pipe(gulp.dest('app/dist'))
      .on('end', done);
  });
});

// test production build in the browser
gulp.task('serve:dist', ['build'], () => {
  gulp.src('app/dist')
    .pipe(webserver({
      livereload: false,
      port: 1338,
      open: true
    }));
});

// remove built files
gulp.task('clean:dist', (done) => {
  rimraf('app/dist', done);
});

// remove all generated files
gulp.task('clean', ['clean:compiled', 'clean:dist']);

gulp.task('default', ['lint', 'watch', 'serve']);
