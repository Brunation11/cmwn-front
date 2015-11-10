/*eslint-disable */
var gulp = require('gulp');
var gulpif = require('gulp-if');
var del = require('del');
var args = require('yargs').argv;
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require("gulp-util");
var webpack = require("webpack");
var gulpWebpack = require('gulp-webpack');
var WebpackDevServer = require("webpack-dev-server");
var webpackDevConfig = require("./webpack.config.dev.js");
var webpackProdConfig = require("./webpack.config.prod.js");
var spawn = require('child_process').spawn;
var eslint = require('gulp-eslint');
var fs = require('fs');
var eslintConfig = JSON.parse(fs.readFileSync('./.eslintrc'));
var env = require('gulp-env');
var _ = require('lodash');
var inject = require('gulp-inject');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var mergeStream = require('merge-stream');

var buildDevelopment = function () {
    env({
        vars: {
            NODE_ENV: 'development',
            BABEL_ENV: 'development'
    }});
    return gulp.src('./src/app.js')
        .pipe(gulpWebpack(Object.create(webpackDevConfig), webpack, function(err, stats) {
            if(err) throw new gutil.PluginError("webpack:build-dev", err);
            gutil.log("[webpack:build-dev]", stats.toString({
                colors: true
            }));
        }))
        .pipe(gulp.dest('./build'));
}

var buildProduction = function () {
    // modify some webpack config options
    var myConfig = Object.create(webpackProdConfig);

    //mark environment as prod
    env({
        vars: {
            NODE_ENV: 'production',
            BABEL_ENV: 'production'
    }});
    // run webpack
    return gulp.src('./src/app.js')
        .pipe(gulpWebpack(myConfig, webpack, function(err, stats) {
            if(err) throw new gutil.PluginError("webpack:build", err);
            gutil.log("[webpack:build]", stats.toString({
                colors: true
            }));
        }))
        .pipe(gulp.dest('./build'));
}

gulp.task("default", ["build-development", "watch", 'development-server']);

gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['lint']);
});

gulp.task('dev-server', ['development-server']);
gulp.task('development-server', function () {
   var start = spawn('npm', ['start']);
   start.stdout.on('data', function (data) {
       console.log('stdout: ' + data);
   });

   start.stderr.on('data', function (data) {
       console.log('stderr: ' + data);
   });
});

gulp.task("build-dev", ["build-development"]);
gulp.task("build-development", ["webpack:build-development"], function() {;});

gulp.task("build", ["webpack:build", 'primary-style', 'index']);

gulp.task('index', function () {
    var target = gulp.src('./src/index.html');

    return target
        .pipe(inject(gulp.src('./build/build.js', {read: false}), {name: 'app'}))
        .pipe(inject(gulp.src('./build/reset.css'), {
            starttag: '<!-- inject:reset -->',
            transform: function (filePath, file) {
                return '<style>\n' + file.contents.toString('utf8') + '\n</style>';
            }
        }))
        .pipe(gulp.dest('./build'));
        /*
         *<!-- inject:style -->
        <!-- endinject -->
        <!-- inject:env -->
        <!-- endinject -->

         */
});

gulp.task('primary-style', function (done) {
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

    var reset = gulp.src('./src/reset.css').pipe(gulp.dest('./build'));

    var primary = gulp.src('./src/styles.js')
        .pipe(gulpWebpack(config, webpack, function (err, stats) {
            if(err) throw new gutil.PluginError("webpack:style", err);
            gutil.log("[webpack:style]", stats.toString({
                colors: true
            }));

            //a little cleanup of intermediate files
            del(['./build/styles.js']);
        })
        .pipe('./build'));
    return mergeStream(reset, primary);
});

gulp.task("webpack:build", function(callback) {
    //mode defaults to development and is selected with the following precedences:
    // --development flag
    // --production flag
    // APP_ENV environment variable
    // NODE_ENV environment variable
    var mode = 'development';
    if (args.development || args.prod) {
        mode = 'development';
    } else if (args.prod || args.production) {
        mode = 'production';
    } else if(process.env.APP_ENV) {
        mode = process.env.APP_ENV;
    } else if (process.env.NODE_ENV) {
        mode = process.env.NODE_ENV;
    }

    if (mode === 'production' || mode == 'prod') {
        return buildDevelopment();
    }
    return buildDevelopment();
});

gulp.task("webpack:build-prod", buildProduction);
gulp.task("webpack:build-production", buildProduction);

gulp.task("webpack:build-dev", buildDevelopment);
gulp.task("webpack:build-development", buildDevelopment);

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
