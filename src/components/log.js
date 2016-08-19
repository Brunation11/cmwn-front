/* eslint-disable no-console, no-debugger*/
import _ from 'lodash';

import GLOBALS from 'components/globals';
import Store from 'components/store';
import Util from 'components/util';

var Log;

class Logger {
    constructor() {
        this.info = this.write('info', 'User Action', '#d0e2ec');
        this.log = this.write('log', 'System', '#bfe2ca');
        this.warn = this.write('warn', 'Warning', '#fed88f');
        this.error = function () {
            this.write('error', 'Error', '#f4858e')(...arguments);
            if (GLOBALS.MODE.toLowerCase() === 'local' ||
                GLOBALS.MODE.toLowerCase() === 'dev' ||
                GLOBALS.MODE.toLowerCase() === 'development') {
                if (GLOBALS.debugging === true || window.debugging === true || this.debugging === true) {
                    debugger;
                }
            }
        };
    }
    write(verb, label, color) {
        return function () {
            var state = Util.scrubPIIFromStore(Store.getState());
            var additionalData = {extraMessages: ''};
            if (GLOBALS.MODE.toLowerCase() === 'local' ||
                GLOBALS.MODE.toLowerCase() === 'dev' ||
                GLOBALS.MODE.toLowerCase() === 'development') {
                console[verb](`%c ${label}: `, `color: ${color};`, ...arguments);
            }

            _.each(arguments, arg => {
                switch (typeof arg) {
                    case 'string':
                        additionalData.extraMessages += arg;
                        break;
                    case 'number':
                        additionalData.extraMessages += arg;
                        break;
                    case 'boolean':
                        additionalData.extraMessages += arg;
                        break;
                    case 'object':
                        additionalData = _.defaults(additionalData, arg);
                        additionalData = _.reduce(additionalData, (a, v, k) => {
                            if (v === window || _.isFunction(v)) {
                                return a;
                            }
                            if (v instanceof window.HTMLElement) {
                                a[k] = `${v.tagName}:${v.id}[${v.className}]`;
                            }
                            try {
                                JSON.stringify(v);
                            } catch(e) {
                                return a;
                            }
                            a[k] = v;
                            return a;
                        }, {});
                }
            });

//            additionalData.state = state;
            Rollbar.configure({payload: {custom: {state}}});

            if (window.Rollbar[verb] != null) {
                window.Rollbar[verb](arguments[0], additionalData); //eslint-disable-line no-undef
            }

            //reset the state for future requests
            Rollbar.configure({payload: {custom: {state: {}}}});
        };
    }
}

Log = new Logger();

export default Log;
