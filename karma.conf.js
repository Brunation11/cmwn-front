var webpackConfig = require('./webpack.config.dev.js');
webpackConfig.devtool = 'inline-source-map';

module.exports = function (config) {
  config.set({
    browsers: [ 'Electron' ],
    // karma only needs to know about the test bundle
    files: [
      'tests.bundle.js'
    ],
    frameworks: [ 'chai', 'mocha' ],
    plugins: [
        'karma-electron-launcher',
        'karma-nodewebkit-launcher',
        'karma-phantomjs2-launcher',
        'karma-phantomjs-launcher',
        'karma-chrome-launcher',
        'karma-chai',
        'karma-mocha',
        'karma-sourcemap-loader',
        'karma-webpack',
    ],
    // run the bundle through the webpack and sourcemap plugins
    preprocessors: {
      'tests.bundle.js': [ 'webpack', 'sourcemap' ]
    },
    reporters: [ 'dots' ],
    singleRun: true,
    // webpack config object
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
    }
  });
};
