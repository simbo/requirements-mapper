'use strict';

var gulp = require('gulp'),
    mocha = require('gulp-mocha');

gulp.task('watch', ['test'], function() {
    gulp.watch([
        './lib/index.js',
        './test/index.js'
    ], ['test']);
});

gulp.task('test', function() {
    return gulp
        .src('./test/index.js', {read: false})
        .pipe(mocha());
});

gulp.task('default', ['test']);
