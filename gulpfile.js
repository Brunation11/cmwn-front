require('babel-core/register');//for mocha to use es6
require('app-module-path').addPath(__dirname + '/src');
/*global require process*/
/*eslint-env node */
/*eslint no-console:0 */
/*eslint-disable vars-on-top */
var gulp = require('gulp');
var del = require('del');
var args = require('yargs').argv;
var path = require('path');
var gutil = require('gulp-util');
var webpack = require('webpack');
var gulpWebpack = require('webpack-stream');
var webpackDevConfig = require('./webpack.config.dev.js');
var webpackProdConfig = require('./webpack.config.prod.js');
var appPackage = require('./package.json');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var spawn = require('child_process').spawn;
var eslint = require('gulp-eslint');
var scsslint = require('gulp-scss-lint');
var stylish = require('gulp-scss-lint-stylish2');
var fs = require('fs');
var eslintConfigJs = JSON.parse(fs.readFileSync('./.eslintrc'));
var eslintConfigTest = JSON.parse(fs.readFileSync('./.eslintrc_test'));
var eslintConfigConfig = JSON.parse(fs.readFileSync('./.eslintrc_config'));
var env = require('gulp-env');
var _ = require('lodash');
var inject = require('gulp-inject');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var mergeStream = require('merge-stream');
var sri = require('gulp-sri');
var mocha = require('gulp-mocha');
var zip = require('gulp-zip');
var webdriver = require('gulp-webdriver');

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
} else if (process.env.APP_ENV) {
    mode = process.env.APP_ENV;
} else if (process.env.NODE_ENV) {
    mode = process.env.NODE_ENV;
}


require.extensions['.css'] = _.noop;
require.extensions['.scss'] = _.noop;
require.extensions['.png'] = _.noop;
require.extensions['.jpg'] = _.noop;
require.extensions['.jpeg'] = _.noop;
require.extensions['.gif'] = _.noop;

/*
___  ______  ______  ______  ______  ______  ______  ______  ______  ______  ______  ______  ______  ___
 __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__
(______)(______)(______)(______)(______)(______)(______)(______)(______)(______)(______)(______)(______)
                                    #1 Build Functions
___  ______  ______  ______  ______  ______  ______  ______  ______  ______  ______  ______  ______  ___
 __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__
(______)(______)(______)(______)(______)(______)(______)(______)(______)(______)(______)(______)(______)
*/

/*
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
    };
};

var buildDevelopment = function () {
    var wpStream = gulpWebpack(webpackDevConfig, null, function (err, stats) {
        var statsStr = stats.toString({
            colors: true
        });
        if (err) {
            throw new gutil.PluginError('webpack:build-dev', err);
        }
        fs.appendFile('build.log', statsStr);
        gutil.log('[webpack:build-dev]', statsStr);
    });

    fs.writeFile('build_errors.log', '');
    fs.writeFile('build.log', ''); //remove this line to persist logs
    fs.appendFile('build.log', `******************** Build Started in ${mode} mode at ${Date.now()}\r\n`);

    env({
        vars: {
            NODE_ENV: 'development',
            BABEL_ENV: 'development'
        }});
    wpStream.on('error', err => {
        fs.writeFile('build_errors.log', err);
        wpStream.end();
        throw err;
    });
    return gulp.src('./src/app.js')
        .pipe(wpStream)
        .pipe(gulp.dest('./build'));
};

var buildProduction = function () {
    // modify some webpack config options
    var myConfig = webpackProdConfig;

    var wpStream = gulpWebpack(myConfig, webpack, function (err, stats) {
        var statsStr = stats.toString({
            colors: true
        });
        if (err) {
            throw new gutil.PluginError('webpack:build', err);
        }
        fs.appendFile('build.log', statsStr);
        gutil.log('[webpack:build]', statsStr);
    });

    wpStream.on('error', err => {
        fs.writeFile('build_errors.log', err);
        wpStream.end();
        throw err;
    });

    fs.writeFile('build_errors.log', '');
    fs.writeFile('build.log', ''); //remove this line to persist logs
    fs.appendFile('build.log', `******************** Build Started in ${mode} mode at ${Date.now()}\r\n`);

    //mark environment as prod
    env({
        vars: {
            NODE_ENV: 'production',
            BABEL_ENV: 'production'
        }});
    // run webpack
    return gulp.src('./src/app.js')
        .pipe(wpStream)
        .pipe(gulp.dest('./build'));
};

var buildIndexPage = function () {
    var target = gulp.src('./src/index.php');
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
                output += '\nwindow.__cmwn.MODE = "local";';
                output += '\nwindow.__cmwn.VERSION = "' + appPackage.version + '";';
                _.each(process.env, function (value, key) {
                    if (key.indexOf(APP_PREFIX) === 0) {
                        console.log('Writing ' + key + ' : ' + value);
                        output +=
                            '\nwindow.__cmwn.' +
                            _.capitalize(key.split(APP_PREFIX)[1]) +
                            ' = ' + JSON.stringify(value) + ';';
                    }
                });
                output += '\n</script>';
                return output;
            }
        }))
        .pipe(inject(gulp.src('./src/app.js', {read: false}), {
            starttag: '<!-- app:js -->',
            transform: function () {
                if (mode === 'production' || mode === 'prod') {
                    return '<script src="/cmwn-' +
                        appPackage.version +
                        '.js" integrity="' +
                        sriHashes['build/cmwn-' +
                        appPackage.version + '.js'] +
                        '" crossorigin="anonymous"></script>';
                }
                return '<script src="/cmwn-' + appPackage.version + '.js"></script>';
            }
        }))
        .pipe(gulp.dest('./build'));
};

var zipTheBuild = function () {
    return gulp.src(['build/**/*.*', 'build/.htaccess'])
      .pipe(zip('build.zip'))
      .pipe(gulp.dest('./'));
};

var buildAndCopyStaticResources = function () {
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
            loaders: [
                {
                    test: /\.js$/,
                    loaders: ['babel'],
                    include: path.join(__dirname, 'src')
                }, {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract('style-loader',
                        'css-loader!autoprefixer-loader!sass-loader')
                }, {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    loader: 'url-loader?limit=10000'
                }, {
                    test: /\.woff$/,
                    loader: 'url?limit=100000'
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin('inline.css')
        ]
    };

    /* eslint-disable no-unused-vars */
    var flips = gulp.src('./src/media/flips/*.*').pipe(gulp.dest('./build/flips'));

    var favicon = gulp.src('./src/media/favicon.ico').pipe(gulp.dest('./build'));

    var htaccess = gulp.src('./.htaccess').pipe(gulp.dest('./build'));

    var packageJson = gulp.src('./package.json').pipe(gulp.dest('./build'));

    var fonts = gulp.src('./src/media/fonts/**/*.*').pipe(gulp.dest('./build/fonts'));

    var reset = gulp.src('./src/reset.css').pipe(gulp.dest('./build'));

    var robots = gulp.src('./src/robots.txt').pipe(gulp.dest('./build'));

    var primary = gulp.src('./src/styles.js')
        .pipe(gulpWebpack(config, webpack, function (err, stats) {
            if (err) {
                throw new gutil.PluginError('webpack:style', err);
            }
            gutil.log('[webpack:style]', stats.toString({
                colors: true
            }));

            //a little cleanup of intermediate files
            del(['./build/styles.js']);
        }))
        .pipe(gulp.dest('./build'));
    return mergeStream(reset, primary);
    /* eslint-enable no-unused-vars */
};

var selectBuildMode = function () {

    if (mode === 'production' || mode === 'prod') {
        gutil.log(gutil.colors.green('Building in production mode'));
        process.env.NODE_ENV = 'production';
        process.env.BABEL_ENV = 'production';
        return buildProduction();
    }
    gutil.log(gutil.colors.green('Building in development mode'));
    return buildDevelopment();
};

/*
___  ______  ______  ______  ______  ______  ______  ______  ______  ______  ______  ______  ______  ___
 __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__
(______)(______)(______)(______)(______)(______)(______)(______)(______)(______)(______)(______)(______)
                                    #2 Task Definitions
___  ______  ______  ______  ______  ______  ______  ______  ______  ______  ______  ______  ______  ___
 __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__
(______)(______)(______)(______)(______)(______)(______)(______)(______)(______)(______)(______)(______)
*/

gulp.task('default', ['build', 'watch', 'development-server']);

gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['test', 'lint', 'showBuildErrors']);
});

/** watches changes to the js and regenerates the index and sris accordingly */
gulp.task('watch-version', function () {
    gulp.watch('build/build.js', ['sri', 'index']);
});

gulp.task('dev-server', ['development-server']);
//using eAP here only to start the express dev server. Not in violation
//of working around gulp streams to produce a sync result
gulp.task('development-server', executeAsProcess('npm', ['start']));

/*·.·´`·.·•·.·´`·.·•·.·´`·.·•·.·´JS Build Tasks`·.·•·.·´`·.·•·.·´`·.·•·.·´`·.·•·.·´`·.·*/
gulp.task('build', ['primary-style', 'webpack:build', 'index'], zipTheBuild);
/** Selects whether to rerun as dev or prod build task*/
gulp.task('webpack:build', selectBuildMode);
/** Convienience methods to run only the webpack portion of a build*/
gulp.task('build-warning', function () {
    console.log(gutil.colors.yellow('Warning: `gulp webpack:build` does not build the index or some styles.' +
        ' Run `gulp build` to build all artifacts'));
});
gulp.task('webpack:build-prod', ['build-warning'], buildProduction);
gulp.task('webpack:build-production', ['build-warning'], buildProduction);
gulp.task('webpack:build-dev', ['build-warning'], buildDevelopment);
gulp.task('webpack:build-development', ['build-warning'], buildDevelopment);
/** This task converts our JS output to utf-8, as this is what the browser expects when generating SRI hashes
 * This task also ultimately produces our final build artifact. */
gulp.task('explicit-utf-8', ['webpack:build'], function (done) {
    exec('iconv -f LATIN1 -t UTF-8 ./build/build.js > ./build/cmwn-' + appPackage.version + '.js', done);
});
/** Convienience Build Aliases */
// eAP here just lets us restart gulp with appropriate flags
// so that build is the single source of truth. Style and index
// are dependent, so we need a way to call different commands
// while still going through the single webpack:build dependency.
// as such, this is how we need to alias build commands.
gulp.task('build-dev', executeAsProcess('gulp build', ['build', '--development']));
gulp.task('build-development', executeAsProcess('gulp build', ['build', '--development']));
gulp.task('build-prod', executeAsProcess('gulp build', ['build', '--production']));
gulp.task('build-production', executeAsProcess('gulp build', ['build', '--production']));

/*·.·´`·.·•·.·´`·.·•·.·´`·.·•·.·´Resource and Static Asset Tasks`·.·•·.·´`·.·•·.·´`·.·•·.·´`·.·•·.·´`·.·*/
gulp.task('index', ['primary-style', 'webpack:build', 'explicit-utf-8', 'sri'], buildIndexPage);

gulp.task('primary-style', buildAndCopyStaticResources);

/** Creates Single Resource Integrity (SRI) hashes for the primary JS*/
gulp.task('sri', ['webpack:build', 'explicit-utf-8'], function () {
    return gulp.src('./build/cmwn-' +
        appPackage.version + '.js').pipe(sri({algorithms: ['sha256']})).pipe(gulp.dest('./build'));
});

/*·.·´`·.·•·.·´`·.·•·.·´`·.·•·.·´Lint and Testing Tasks`·.·•·.·´`·.·•·.·´`·.·•·.·´`·.·•·.·´`·.·*/
gulp.task('lint', ['lint-js', 'lint-config', 'lint-scss']);
gulp.task('lint-js', function () {
    return gulp.src(['src/**/*.js', '!src/**/*.test.js'])
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules.
        .pipe(eslint(eslintConfigJs))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        .pipe(eslint.format('stylish', fs.createWriteStream('jslint.log')))
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});
gulp.task('lint-test', function () {
    return gulp.src(['src/**/*.test.js'])
        .pipe(eslint(_.defaultsDeep(eslintConfigTest, eslintConfigJs)))
        .pipe(eslint.format())
        .pipe(eslint.format('stylish', fs.createWriteStream('testlint.log')))
        .pipe(eslint.failAfterError());
});
gulp.task('lint-config', function () {
    return gulp.src(['gulpfile.js', 'webpack.config.dev.js', 'webpack.config.prod.js'])
        .pipe(eslint(_.defaultsDeep(eslintConfigConfig, eslintConfigJs)))
        .pipe(eslint.format())
        .pipe(eslint.format('stylish', fs.createWriteStream('configlint.log')))
        .pipe(eslint.failAfterError());
});
gulp.task('lint-scss', function () {
    var reporter = stylish();
    return gulp.src(['src/**/*.scss'])
        .pipe(scsslint({
            customReport: reporter.issues,
            reporterOutput: 'scsslint.json'
        }))
        .pipe(reporter.printSummary)
        .pipe(scsslint.failReporter());
});

gulp.task('unit', function () {
    process.env.NODE_ENV = 'production';
    process.env.BABEL_ENV = 'production';
    var tests = gulp.src(['src/**/*.test.js'], {read: false})
         .pipe(mocha({
             require: ['./src/testdom.js'],
             timeout: 2000,
             reporter: 'min'
         }))
         .once('error', () => {
             process.exit(1);
         })
         .once('end', () => {
             process.exit();
         });
    tests.on('error', function (err) {
        console.log('SOMETHING HAPPENED:' + err);
    });
    return tests;
});

gulp.task('smoke', function () {
    process.env.NODE_ENV = 'production';
    process.env.BABEL_ENV = 'production';
    var tests = gulp.src(['./smoke.test.js'], {read: false})
         .pipe(mocha({require: ['./src/testdom.js'], reporter: 'min'}));
    tests.on('error', function (err) {
        console.log('SOMETHING HAPPENED:' + err);
    });
    return tests;
});

gulp.task('coverage', function () {
    var proc = spawn('./.test/test.sh');

    proc.on('exit', function (exitCode) {
        console.log('process exited with code ' + exitCode);
    });

    proc.stdout.on('data', function (chunk) {
        console.log('' + chunk);
    });

    proc.stdout.on('end', function () {
        console.log('finished collecting data chunks from stdout');
    });
});


gulp.task('e2e', () => {
    var overrideHostIP = process.env.DOCKER_HOST_IP;
    var hostIP = overrideHostIP || execSync('docker-machine ip front').toString().split('\n')[0];
    if (hostIP === '' || hostIP == null) {
        console.error('No docker IP available for selenium host. Integration tests will fail.');
    }
    var browser = args.firefox ? 'firefox' : 'chrome'; // chrome by default
    return gulp.src('wdio.conf.js').pipe(webdriver({
        host: hostIP,
        capabilities: [{ browserName: browser }]
    }));
});

gulp.task('test', ['e2e', 'unit'], () => {
});

//this task is only required when some post-build task intentionally clears the console, as our tests do
gulp.task('showBuildErrors', function () {
    console.log(fs.readFileSync('build_errors.log'));
});


