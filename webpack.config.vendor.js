// vendor-bundles.webpack.config.js
var webpack = require('webpack');

module.exports = {
  entry: {
    // create two library bundles, one with jQuery and
    // another with Angular and related libraries
    'vendor': [
        "Base64",
        "alertify.js",
        "babel-polyfill",
        "classnames",
        "fbjs",
        "history",
        "humane-js",
        "immutable",
        "lodash",
        "moment",
        "null-loader",
        "prepend-loader",
        "query-string",
        "react",
        "react-addons-update",
        "react-bootstrap",
        "react-bootstrap-date-picker",
        "react-redux",
        "react-router",
        "react-router-redux",
        "redux",
        "redux-combine-actions",
        "redux-immutable",
        "redux-promise-middleware",
        "redux-thunk",
        "reselect",
        "ruby",
        "screenfull",
        "seamless-immutable",
        "shortid",
        "sweetalert2"
    ],
  },

  output: {
    filename: '[name].bundle.js',
    path: 'build/',

    // The name of the global variable which the library's
    // require() function will be assigned to
    library: '[name]_lib',
  },

  plugins: [
    new webpack.DllPlugin({
      // The path to the manifest file which maps between
      // modules included in a bundle and the internal IDs
      // within that bundle
      path: 'build/[name]-manifest.json',
      // The name of the global variable which the library's
      // require function has been assigned to. This must match the
      // output.library option above
      name: '[name]_lib'
    }),
  ],
}
