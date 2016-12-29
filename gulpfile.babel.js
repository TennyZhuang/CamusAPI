const gulp = require('gulp')
const sourceMaps = require('gulp-sourcemaps')
const clean = require('gulp-clean')
const babel = require('gulp-babel')
const src = ['app/**/*.js', 'test/**/*.js']
const copy = ['test/**/*.json', 'test/**/*.html']
const srcOption = {base: './'}
const dest = './dist'

gulp.task('default', ['clean'], () => {
  gulp.start('copy')
  return gulp.src(src, srcOption)
    .pipe(sourceMaps.init())
    .pipe(babel())
    .pipe(sourceMaps.write('.', {
      includeContent: false,
      sourceRoot: '.'
    }))
    .pipe(gulp.dest(dest))
})

gulp.task('clean', () => {
  return gulp.src(dest, {read: false})
    .pipe(clean())
})

gulp.task('copy', () => {
  return gulp.src(copy)
    .pipe(gulp.dest('./dist/test'))
})
