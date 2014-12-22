'use strict';

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    minifyhtml = require('gulp-minify-html'),
    ngannotate = require('gulp-ng-annotate'),
    path = require('path'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-ruby-sass'),
    svgmin = require('gulp-svgmin'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch');

/**
 * Scripts
 */

gulp.task('vendor', function () {
    gulp.src([
        './bower_components/jquery/dist/jquery.js',
        './bower_components/angular/angular.js',
        './bower_components/angular-route/angular-route.js'
    ])
        .pipe(plumber())
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('app', function () {
    gulp.src([
        './src/js/**/*.js'
    ])
        .pipe(plumber())
        .pipe(jshint())
        .pipe(concat('main.js'))
        .pipe(ngannotate({
            remove: true,
            add: true,
            single_quotes: true
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('scripts', ['vendor', 'app']);

gulp.task('scripts:watch', function () {
    gulp.watch('./src/js/**/*.js', ['scripts']);
});

gulp.task('scripts:clean', function () {
    del('./dist/js');
});

/**
 * Templates
 */

gulp.task('index', function () {
    gulp.src('./src/index.html')
        .pipe(plumber())
        .pipe(minifyhtml())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('views', function () {
    gulp.src('./src/views/**/*.html')
        .pipe(plumber())
        .pipe(minifyhtml())
        .pipe(gulp.dest('./dist/views/'));
});

gulp.task('templates', ['index', 'views']);

gulp.task('templates:watch', function () {
    gulp.watch([
        './src/index.html',
        './src/views/**/*.html'
    ], ['templates']);
});

gulp.task('templates:clean', function () {
    del([
        './dist/index.html',
        './dist/views'
    ]);
});

/**
 * Styles
 */

gulp.task('styles', function () {
    gulp.src('./src/sass/main.sass')
        .pipe(plumber())
        .pipe(sass({
            style: 'compressed',
            'sourcemap=none': true,
            loadPath: [
                path.join(process.cwd(), './src/sass'),
                path.join(process.cwd(), './bower_components'),
            ]
        }))
        .on('error', function (err) {
            console.log(err.message);
        })
        .pipe(autoprefixer(['last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('styles:watch', function () {
    gulp.watch('./src/sass/**/*', ['styles']);
});

gulp.task('styles:clean', function () {
    del('./dist/css');
});

/**
 * Images
 */

gulp.task('bitmaps', function () {
    gulp.src('./src/img/**/*.{jpg,png,gif}')
        .pipe(plumber())
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('./dist/img/'));
});

gulp.task('vectors', function () {
    gulp.src('./src/img/**/*.svg')
        .pipe(plumber())
        .pipe(svgmin())
        .pipe(gulp.dest('./dist/img/'));
});

gulp.task('images', ['bitmaps', 'vectors']);

gulp.task('images:watch', function () {
    gulp.watch('./src/img/**/*.{svg,jpg,png,gif}', ['images']);
});

gulp.task('images:clean', function () {
    del('./dist/img');
});

/**
 * Fonts
 */

gulp.task('fonts', function () {
    gulp.src('./src/fonts/**/*')
        .pipe(plumber())
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('fonts:watch', function () {
    gulp.watch('./src/fonts/**/*', ['fonts']);
});

gulp.task('fonts:clean', function () {
    del('./dist/fonts');
});

/**
 * So Let's Go
 */

gulp.task('clean', ['scripts:clean', 'templates:clean', 'styles:clean', 'images:clean', 'fonts:clean']);
gulp.task('watch', ['scripts:watch', 'templates:watch', 'styles:watch', 'images:watch', 'fonts:watch']);
gulp.task('build', ['scripts', 'templates', 'styles', 'images', 'fonts']);

gulp.task('default', ['clean', 'build', 'watch']);
