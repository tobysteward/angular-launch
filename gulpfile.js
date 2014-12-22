'use strict';

var gulp = require('gulp'),
    del = require('del'),
    path = require('path'),
    plugins = require('gulp-load-plugins')();

/**
 * Scripts
 */

gulp.task('vendor', function (cb) {
    gulp.src([
        './bower_components/jquery/dist/jquery.js',
        './bower_components/angular/angular.js',
        './bower_components/angular-route/angular-route.js'
    ])
        .pipe(plugins.streamify(plugins.concat('vendor.js')))
        .pipe(plugins.streamify(plugins.uglify({ mangle: false })))
        .pipe(plugins.streamify(plugins.size({ showFiles: true })))
        .pipe(gulp.dest('./dist/js'))
        .on('end', cb)
        .on('error', plugins.util.log);
});

gulp.task('app', function (cb) {
    gulp.src([
        './src/js/**/*.js'
    ])
        .pipe(plugins.streamify(plugins.plumber()))
        .pipe(plugins.streamify(plugins.jshint()))
        .pipe(plugins.streamify(plugins.concat('main.js')))
        .pipe(plugins.streamify(plugins.ngAnnotate({
            remove: true,
            add: true,
            single_quotes: true
        })))
        .pipe(plugins.streamify(plugins.uglify({ mangle: false })))
        .pipe(plugins.size({ showFiles: true }))
        .pipe(gulp.dest('./dist/js'))
        .on('end', cb)
        .on('error', plugins.util.log);
});

gulp.task('scripts', ['vendor', 'app']);

gulp.task('scripts:clean', function (cb) {
    del(['./dist/js/vendor.js', './dist/js/main.js'], cb);
});

gulp.task('scripts:watch', function () {
    gulp.watch('./src/js/**/*.js', ['scripts']);
});


/**
 * Index
 */

gulp.task('index', function (cb) {
    gulp.src('./src/index.html')
        .pipe(plugins.plumber())
        .pipe(plugins.streamify(plugins.minifyHtml()))
        .pipe(gulp.dest('./dist/'))
        .on('end', cb)
        .on('error', plugins.util.log);
});

gulp.task('index:watch', function () {
    gulp.watch([
        './src/index.html'
    ], ['index']);
});

gulp.task('index:clean', function (cb) {
    del('./dist/index.html', cb);
});

/**
 * Templates
 */

gulp.task('templates', function (cb) {
    gulp.src('./src/views/**/*.html')
        .pipe(plugins.plumber())
        .pipe(plugins.streamify(plugins.minifyHtml()))
        .pipe(plugins.angularTemplatecache({
            root: '/views/',
            module: 'app'
        }))
        .pipe(plugins.size({ showFiles: true }))
        .pipe(gulp.dest('./dist/js'))
        .on('end', cb)
        .on('error', plugins.util.log);
});

gulp.task('templates:watch', function () {
    gulp.watch([
        './src/views/**/*.html'
    ], ['templates']);
});

gulp.task('templates:clean', function (cb) {
    del('./dist/js/templates.js', cb);
});

/**
 * Styles
 */

gulp.task('styles', function (cb) {
    gulp.src('./src/sass/main.sass')
        .pipe(plugins.plumber())
        .pipe(plugins.streamify(plugins.rubySass({
            style: 'compressed',
            'sourcemap=none': true,
            loadPath: [
                path.join(process.cwd(), './src/sass'),
                path.join(process.cwd(), './bower_components'),
            ]
        })))
        .pipe(plugins.streamify(plugins.autoprefixer(['last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'])))
        .pipe(plugins.size({ showFiles: true }))
        .pipe(gulp.dest('./dist/css'))
        .on('end', cb)
        .on('error', plugins.util.log);
});

gulp.task('styles:watch', function () {
    gulp.watch('./src/sass/**/*', ['styles']);
});

gulp.task('styles:clean', function (cb) {
    del('./dist/css', cb);
});

/**
 * Images
 */

gulp.task('bitmaps', function (cb) {
    gulp.src('./src/img/**/*.{jpg,png,gif}')
        .pipe(plugins.streamify(plugins.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(plugins.size({ showFiles: true }))
        .pipe(gulp.dest('./dist/img/'))
        .on('end', cb)
        .on('error', plugins.util.log);
});

gulp.task('vectors', function (cb) {
    gulp.src('./src/img/**/*.svg')
        .pipe(plugins.streamify(plugins.svgmin()))
        .pipe(plugins.size({ showFiles: true }))
        .pipe(gulp.dest('./dist/img/'))
        .on('end', cb)
        .on('error', plugins.util.log);
});

gulp.task('images', ['bitmaps', 'vectors']);

gulp.task('images:watch', function () {
    gulp.watch('./src/img/**/*.{svg,jpg,png,gif}', ['images']);
});

gulp.task('images:clean', function (cb) {
    del('./dist/img', cb);
});

/**
 * Fonts
 */

gulp.task('fonts', function (cb) {
    gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts'))
        .on('end', cb)
        .on('error', plugins.util.log);
});

gulp.task('fonts:watch', function () {
    gulp.watch('./src/fonts/**/*', ['fonts']);
});

gulp.task('fonts:clean', function (cb) {
    del('./dist/fonts', cb);
});

/**
 * So Let's Go
 */

gulp.task('clean', ['scripts:clean', 'templates:clean', 'index:clean', 'styles:clean', 'images:clean', 'fonts:clean']);
gulp.task('watch', ['scripts:watch', 'templates:watch', 'index:watch', 'styles:watch', 'images:watch', 'fonts:watch']);
gulp.task('build', ['scripts', 'templates', 'index', 'styles', 'images', 'fonts']);

gulp.task('default', ['clean', 'build', 'watch']);
