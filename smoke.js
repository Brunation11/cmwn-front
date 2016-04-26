var JsDom = require('jsdom');

var Rollbar = function () {;};
Rollbar.configure = Rollbar;

global.document = JsDom.jsdom('<!DOCTYPE html><html><head></head><body></body></html>', {url: 'http://localhost'});
global.window = document.defaultView;
global.navigator = global.window.navigator;
global.window.localStorage = {};
global.window.Rollbar = Rollbar;
global.Rollbar = Rollbar
global.window.__cmwn = {};
global.window.location = window.history.location || window.location || {href: 'https://changemyworldnow.com/'};
//global.window.__cmwn
//global.window.__cmwn.
require('./build/test.js');
