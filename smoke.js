var JsDom = require('jsdom');

global.document = JsDom.jsdom('<!DOCTYPE html><html><head></head><body></body></html>');
global.window = document.defaultView;
global.navigator = window.navigator;
global.window.localStorage = {};
global.window.Rollbar = null;
global.window.__cmwn = {};
//global.window.__cmwn
//global.window.__cmwn.

require('./build/test.js');
