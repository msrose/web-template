import gulp from 'gulp';

import './tasks/serve';
import './tasks/sass';
import './tasks/javascript';
import './tasks/build';
import './tasks/clean';

var nodeFiles = [
  'node_modules/babel-polyfill/dist/polyfill.min.js',
  'node_modules/normalize.css/normalize.css'
];

// copy files from npm packages to be used in browser
gulp.task('copy:node', () => {
  return gulp.src(nodeFiles)
    .pipe(gulp.dest('app/public/lib/node'));
});

gulp.task('lint', ['sass:lint', 'js:lint']);

gulp.task('lint:watch', ['js:lint:watch', 'sass:lint:watch']);

gulp.task('watch', ['sass:watch', 'babel:watch', 'lint:watch']);

gulp.task('compile', ['sass', 'babel']);

gulp.task('clean', ['clean:compiled', 'clean:dist']);

gulp.task('default', ['lint', 'watch', 'serve']);
