var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
//var source = require('vinyl-source-stream');
//var buffer = require('vinyl-buffer');
//var browserify = require('browserify');
//var watchify = require('watchify');
//var babel = require('babelify');
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackDevConfig = require("./webpack.config.dev.js");
var webpackProdConfig = require("./webpack.config.prod.js");
var spawn = require('child_process').spawn;
var eslint = require('gulp-eslint');
var fs = require('fs');
var eslintConfig = JSON.parse(fs.readFileSync('./.eslintrc'));
var watch = require('gulp-watch');

gulp.task("default", ["watch", "build-dev"]);
gulp.task("echo", function () { console.log('workin')});
gulp.task('watch', function () {
    watch('src/**/*.js', ['lint']);
    //watch('**/*', ['echo']);
});

gulp.task("build-dev", ["webpack:build-dev"], function() {
    var start = spawn('npm', ['start']);
    start.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    start.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
});

// Production build
gulp.task("build", ["webpack:build"]);

gulp.task("webpack:build", function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackProdConfig);
    
    // run webpack
    webpack(myConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task("webpack:build-dev", function(callback) {
    webpack(Object.create(webpackDevConfig)).run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-dev", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('lint', function () {
    return gulp.src(['src/**/*.js'])
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules.
        .pipe(eslint(Object.create(eslintConfig)))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
//        .pipe(eslint.failAfterError());
});
