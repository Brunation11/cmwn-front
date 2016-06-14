/* eslint-disable */
var jsdom = require('jsdom')
var _ = require('lodash')

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
global.window.localStorage = {
    cmwn_token: '',
    setItem: function (key, val) {
        this[key] = val;
    },
    getItem: function () {
        return '';
    }
};
global.window.console = global.console;
global.console.error = global.console.error || _.noop;
global.window.Rollbar = global.window.Rollbar || {
	error: _.noop,
	configure: _.noop
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
