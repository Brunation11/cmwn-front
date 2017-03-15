'use strict';
var _;
var jsdom;
/* eslint-disable */
require('babel-core/register');//for mocha to use es6
require('app-module-path').addPath(__dirname + '/src');
_ = require('lodash');
import LocalStorage from 'components/local_storage';

require.extensions['.css'] = _.noop;
require.extensions['.scss'] = _.noop;
require.extensions['.png'] = _.noop;
require.extensions['.jpg'] = _.noop;
require.extensions['.jpeg'] = _.noop;
require.extensions['.gif'] = _.noop;
jsdom = require('jsdom')

// setup the simplest document possible
var doc = jsdom.jsdom('<!doctype html><html><body></body></html>')

// get the window object out of the document
var win = doc.defaultView

// set globals for mocha that make access to document and window feel
// natural in the test environment
global.document = doc
global.window = win
global.window.MODE = 'test';
global.window.__cmwn = {};
global.window.__cmwn.MODE = 'test';
global.window.cmwn_token = '';
LocalStorage.testDom();
global.window.console = global.console;
global.console.error = global.console.error || _.noop;
global.window.Rollbar = global.window.Rollbar || {
	error: _.noop,
	configure: _.noop
};
global.window.sessionStorage = {};
global.window.sessionStorage.getItem = _.noop;
global.window.sessionStorage.setItem = _.noop;

global.window.grecaptcha = {
    render: function(container, params) {
        if (params && params.callback) {
            params.callback();
        }
        return null;
    },
    reset: function(a, b) {
        return null;
    }
};

// take all properties of the window object and also attach it to the
// mocha global object
propagateToGlobal(win)

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
function propagateToGlobal (window) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue
    if (key in global) continue

    global[key] = window[key]
  }
}
