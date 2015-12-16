const gulp = require('gulp')
const vinyl = require('vinyl-source-stream')


const browserify = require('browserify')
const babelify = require('babelify')
gulp.task('build:browserify', () => {
  browserify('./src/index.js', {debug: true})
    .transform('browserify-shim', { global: true })
    .transform(babelify, {presets: ["es2015", ]})
    .bundle()
    .on('error', (err) => {console.log('Error: ' + err.message)})
    .pipe(vinyl('index.js'))
    .pipe(gulp.dest('lib/'))
})


gulp.task('lint', () => {
  const eslint = require('gulp-eslint')
  gulp.src('./src/**/*.js*')
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format())
    .pipe(eslint.results((result) => {
      // Called for each ESLint result.
      console.log('ESLint result: ' + result.filePath);
      console.log('# Messages: ' + result.messages.length);
      console.log('# Warnings: ' + result.warningCount);
      console.log('# Errors: ' + result.errorCount);
    }));
  }
)


gulp.task('doc', () => {
  const esdoc = require('gulp-esdoc');
  gulp.src('./src/')
    .pipe(esdoc({
      destination: './docs',
      includes: ["\\.(js|es6|jsx)$"],
      plugins: [
        {name: 'esdoc-es7-plugin'}
      ]
    }));
});


gulp.task('default', ['build'])


gulp.task('build', [
  'build:browserify',
])


gulp.task('watch', ['build'], () => {
  gulp.watch('src/script/**/*', ['build:browserify']);
})
gulp.task('watch:lint', ['lint'], () => {
  gulp.watch('src/script/**/*', ['lint'])
})

