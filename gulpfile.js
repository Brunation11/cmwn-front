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
var appPackage = require('./package.json');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var eslint = require('gulp-eslint');
var fs = require('fs');
var eslintConfig = JSON.parse(fs.readFileSync('./.eslintrc'));
var env = require('gulp-env');
var _ = require('lodash');
var inject = require('gulp-inject');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var mergeStream = require('merge-stream');
var sri = require('gulp-sri');

/** @const */
var APP_PREFIX = 'APP_';

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

/**
 * Higher order function. Starts an arbitrary shell command
 * note that this is not a gulp best practice, and should be
 * used sparingly and only with justification.
 * @param {string} command - command to run
 * @param {string[]} [flags = []] - any flags that need to be passed to command
 */
var executeAsProcess = function (command, flags) {
    return function () {
       var start = spawn(command, flags);
       start.stdout.on('data', function (data) {
           console.log('stdout: ' + data);
       });

       start.stderr.on('data', function (data) {
           console.log('stderr: ' + data);
       });
    }
}

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

gulp.task("default", ["build", "watch", 'development-server']);

gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['lint']);
});

gulp.task('dev-server', ['development-server']);
//using eAP here only to start the express dev server. Not in violation
//of working around gulp streams to produce a sync result
gulp.task('development-server', executeAsProcess('npm', ['start']));

gulp.task("build", ['primary-style', "webpack:build", 'index']);
// eAP here just lets us restart gulp with appropriate flags
// so that build is the single source of truth. Style and index
// are dependent, so we need a way to call different commands
// while still going through the single webpack:build dependency.
// as such, this is how we need to alias build commands.
gulp.task("build-dev", executeAsProcess('gulp build', ['build', '--development']));
gulp.task("build-development", executeAsProcess('gulp build', ['build', '--development']));
gulp.task("build-prod", executeAsProcess('gulp build', ['build', '--development']));
gulp.task("build-production", executeAsProcess('gulp build', ['build', '--development']));

gulp.task('index', ['primary-style', 'webpack:build', 'explicit-utf-8', 'sri'], function () {
    var target = gulp.src('./src/index.html');
    var sriHashes = JSON.parse(fs.readFileSync('./build/sri.json'));

    return target
        .pipe(inject(gulp.src('./build/inline.css'), {
            starttag: '<!-- inject:style -->',
            transform: function (filePath, file) {
                return '<style>\n' + file.contents.toString('utf8') + '\n</style>';
            }
        }))
        .pipe(inject(gulp.src('./build/reset.css'), {
            starttag: '<!-- inject:reset -->',
            transform: function (filePath, file) {
                return '<style>\n' + file.contents.toString('utf8') + '\n</style>';
            }
        }))
        .pipe(inject(gulp.src('./src/app.js', {read: false}), {
            starttag: '<!-- inject:env -->',
            transform: function () {
                //note: we aren't actually doing anything with app.js, but a file is mandatory
                var output = '<script>';
                output += '\nwindow.__cmwn = {};';
                _.each(process.env, function (value, key) {
                    if(key.indexOf(APP_PREFIX) === 0) {
                        console.log('Writing ' + key + ' : ' + value);
                        output += '\nwindow.__cmwn.' + _.capitalize(key.split(APP_PREFIX)[1]) + ' = ' + JSON.stringify(value) + ';';
                    }
                });
                output += '\n</script>';
                return output;
            }
        }))
        .pipe(inject(gulp.src('./src/app.js', {read: false}), {
            starttag: '<!-- app:js -->',
            transform: function () {
                /* Disabling SRI until such a time as chrome correctly generates hashes of files containing non-ascii characters: https://code.google.com/p/chromium/issues/detail?id=527286,  https://code.google.com/p/chromium/issues/detail?id=527436
                */
                if (mode === 'production' || mode === 'prod') {
                    return '<script src="/cmwn-' + appPackage.version + '.js" integrity="' + sriHashes['build/cmwn-' + appPackage.version + '.js'] + '" crossorigin="anonymous"></script>';
                }
                return '<script src="/cmwn-' + appPackage.version + '.js"></script>';
            }
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('explicit-utf-8', ['webpack:build'], function(done) {
    exec('iconv -f utf-8 ./build/build.js > ./build/cmwn-' + appPackage.version + '.js', done)
//    executeAsProcess('iconv', '-f ./build/build.js > ./build/buildz.js');
});

gulp.task('sri', ['webpack:build', 'explicit-utf-8'], function () {
    return gulp.src('./build/cmwn-' + appPackage.version + '.js').pipe(sri({algorithms: ['sha256']})).pipe(gulp.dest('./build'))
})

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
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!sass-loader')
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

    var favicon = gulp.src('./src/media/favicon.ico').pipe(gulp.dest('./build'));

    var reset = gulp.src('./src/reset.css').pipe(gulp.dest('./build'));

    var robots = gulp.src('./src/robots.txt').pipe(gulp.dest('./build'));

    var primary = gulp.src('./src/styles.js')
        .pipe(gulpWebpack(config, webpack, function (err, stats) {
            if(err) throw new gutil.PluginError("webpack:style", err);
            gutil.log("[webpack:style]", stats.toString({
                colors: true
            }));

            //a little cleanup of intermediate files
            del(['./build/styles.js']);
        }))
        .pipe(gulp.dest('./build'));
    return mergeStream(reset, primary);
});

gulp.task("webpack:build", function(done) {

    if (mode === 'production' || mode == 'prod') {
        gutil.log(gutil.colors.green('Building in production mode'));
        process.env.NODE_ENV = 'production';
        process.env.BABEL_ENV = 'production'
        return buildProduction();
    }
    gutil.log(gutil.colors.green('Building in development mode'));
    return buildDevelopment();
});

gulp.task('build-warning', function () {
    console.log(gutil.colors.yellow('Warning: `gulp webpack:build` does not build the index or some styles. Run `gulp build` to build all artifacts'));
});

gulp.task("webpack:build-prod", ['build-warning'], buildProduction);
gulp.task("webpack:build-production", ['build-warning'], buildProduction);

gulp.task("webpack:build-dev", ['build-warning'], buildDevelopment);
gulp.task("webpack:build-development", ['build-warning'], buildDevelopment);

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
