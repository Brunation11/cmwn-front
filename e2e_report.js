/*eslint-disable no-console, no-unused-vars, no-native-reassign*/
/*global exports module */
//from https://gist.github.com/jurgob/c86920043f0a7c766b79eb63562e15fe
var util = require('util');
var events = require('events');

var colors = require('colors'); //eslint-disable-line no-unused-vars

var testsResults = {
    passed: 0,
    failed: 0
};


var CustomReporter = function () {
    console.log('############################');
    console.log('##    Test chain start    ##');
    console.log('############################');
    console.log('');

    this.on('start', function () {
        // console.log('start');
    });

    this.on('end', function () {
        // console.log('**** end ',param1);
        // console.log('end');
        console.log('');
        console.log('-------------------');
        if (!testsResults.failed) {
            console.log('all tests passed'.green);
        } else {
            console.log((testsResults.failed + ' test failed').red);
        }
        console.log('');
        console.log('test report: ',
            testsResults.failed +
                testsResults.passed +
                ' total tests, ' +
                testsResults.passed +
                ' passed, ' +
                testsResults.failed +
                ' failed'
        );
    });

    this.on('suite:start', function (param1) {
        // console.log('suite:start', param1);
        console.log(param1.title);
    });

    this.on('suite:end', function () {
        // console.log('suite:end');
    });

    this.on('test:start', function () {
        // console.log('test:start');
    });

    this.on('test:end', function () {
        // console.log('test:end');
    });

    this.on('hook:start', function () {
        // console.log('hook:start');
    });

    this.on('hook:end', function () {
        // console.log('hook:end');
    });

    this.on('test:pass', function (param1) {
        // console.log('test:pass');
        testsResults.passed++;
        var text = param1.title;
        console.log((' V'.green + '  ' + text) );
    });

    this.on('test:fail', function (param1) {
        var text = param1.title;
        testsResults.failed++;
        console.log((' X'.red + '  ' + text));
        console.log(('    ' + param1.err.message).red);
        console.log(('    ' + param1.err.stack).red);

    });

    this.on('test:pending', function () {
        // console.log('test:pending');
    });
};

/**
 * Inherit from EventEmitter
 */

util.inherits(CustomReporter, events.EventEmitter);
CustomReporter.reporterName = 'e2eReporter';
/**
 * Expose Custom Reporter
 */
exports = module.exports = CustomReporter;
