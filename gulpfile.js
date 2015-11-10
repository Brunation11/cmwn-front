/*eslint-disable */
var gulp = require('gulp');
var del = require('del');
var args = require('yargs').argv;
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
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
var env = require('gulp-env');
var _ = require('lodash');
var inject = require('gulp-inject');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

gulp.task("default", ["build-dev", "watch"]);

gulp.task('watch', function () {
    var start = spawn('npm', ['start']);

    watch('src/**/*.js', function () {
        gulp.start('lint');
    });

    start.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    start.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

});

gulp.task("build-dev", ["webpack:build-dev"], function() {;});

gulp.task("build", ["webpack:build", 'primary-style', 'index']);

gulp.task('index', function () {
    var target = gulp.src('./src/index.html');

    return target
        .pipe(inject(gulp.src('./build/build.js', {read: false}), {name: 'app'}))
        .pipe(gulp.dest('./build'));
});

gulp.task('primary-style', function () {
    gulp.src('./src/reset.css').pipe(gulp.dest('./build'));

    var config = {
        resolve: {
            root: path.resolve('./src'),
            extensions: ['', '.js']
        },
        entry: ['styles'],
        output: {
            path: path.join(__dirname, 'build'),
            filename: 'styles.js',
            publicPath: '/'
        },
        module: {
            loaders: [{
                test: /\.js$/,
                loaders: ['babel'],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'url-loader?limit=10000'
            }]
        },
        plugins: [
            new ExtractTextPlugin('inline.css')
        ]
    };

    webpack(config, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:style", err);
        gutil.log("[webpack:style]", stats.toString({
            colors: true
        }));

        //a little cleanup of intermediate files
        del(['./build/styles.js']);
    });


});

gulp.task("webpack:build", function(callback) {
    var mode = process.env.APP_ENV;
    if (args.prod || args.production || (!args.production && mode === 'production')) {
        gulp.start('webpack:build-prod');
    } else {
        gulp.start('webpack:build-dev');
    }
});

gulp.task("webpack:build-prod", function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackProdConfig);

    //mark environment as prod
    env({
        vars: {
            NODE_ENV: 'production',
            BABEL_ENV: 'production'
    }});
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
    env({
        vars: {
            NODE_ENV: 'development',
            BABEL_ENV: 'development'
    }});
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
