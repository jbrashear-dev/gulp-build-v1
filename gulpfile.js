'use strict';
const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const maps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const del = require('del');
const connect = require('gulp-connect');

gulp.task('serverStart', () =>{
  connect.server({
    livereload: true,
    port: 3000,
    host: '127.0.0.1'
  })
  console.log('server started 3050....')
})

gulp.task('concatScripts', () => {
  return gulp.src([
    'js/circle/autogrow.js',
    'js/circle/circle.js',
    'js/global.js'
  ])
  .pipe(maps.init())
  .pipe(concat('all.js'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('js'));
});

gulp.task('scripts', ['concatScripts'], () => {
  return gulp.src('js/all.js')
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('compileSass', () => {
  return gulp.src('sass/*.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(rename('all.css'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('css'));
});

gulp.task('styles', ['compileSass'], () => {
  return gulp.src('css/all.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(connect.reload());
});

gulp.task('images', () => {
  return gulp.src('images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/content/'));

});

gulp.task('watchFiles', () => {
  gulp.watch('sass/**/*.scss', ['styles']);
})

gulp.task('clean', () => {
  del(['dist', 'js/all*', 'css']);
});

gulp.task('distro', ['scripts', 'styles', 'images'], () => {

})

gulp.task('build', ['clean'], () => {
  gulp.start('distro');
})


gulp.task('default', () => {
  gulp.start('build');
  gulp.start('serverStart');
  gulp.start('watchFiles');
})
