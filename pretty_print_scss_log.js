#!/usr/bin/env node

var scss = require('./scsslint.json');
var _ = require('lodash');
var os = require('os');

_.each(scss, (errorlist, filename) => {
    console.log('[4m' + filename + '[24m');
    _.each(errorlist, error => {
        var errors = '';
        errors += '[37m' + 'line: ' + error.line + ', col: ' + error.column + ' ';
        errors += '[31m' + error.linter + ': ';
        errors += '[91m' + error.reason + '[0m';
        errors += os.EOL;
        console.log(errors);
    });
})

