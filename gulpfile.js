'use strict';

//Load all Gulp modules
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	plumber = require('gulp-plumber'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	livereload = require('gulp-livereload'),
	connect = require('gulp-connect'),

	//variables to reference all javascript files
	jsFiles = ['app/scripts/*.js'],
	scssFiles = ['app/styles/main.scss'];


// Precompile Sass
gulp.task('sass', function() {

  gulp.src(scssFiles)
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('app/styles'))
    .pipe(connect.reload());
});


gulp.task('devServer', function () {
  connect.server({
    root: [__dirname],
    port: 8000,
    livereload: true
  });
});

//Jshint all JS files
gulp.task('lint',function(){
	gulp.src(jsFiles)
	.pipe(jshint())
	.pipe(jshint.reporter(stylish))
	.pipe(connect.reload());
});

//update HTML with livereload
gulp.task('html', function(){
	  gulp.src('index.html')
    	.pipe(plumber())
    	.pipe(connect.reload());
});

//watch task to re-run other tasks on save
gulp.task('watch', function() {
  gulp.watch(scssFiles, ['sass']);
  gulp.watch(['index.html'], ['html']);
  gulp.watch(jsFiles, ['lint']);
});



//task to run all
gulp.task('default', ['devServer','sass','lint', 'watch']);