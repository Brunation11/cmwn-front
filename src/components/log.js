/* eslint-disable no-console, no-debugger*/
import GLOBALS from 'components/globals';

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
            if (GLOBALS.MODE.toLowerCase() === 'local' ||
                GLOBALS.MODE.toLowerCase() === 'dev' ||
                GLOBALS.MODE.toLowerCase() === 'development') {
                console[verb](`%c ${label}: `, `color: ${color};`, ...arguments);
            }
            if (window.Rollbar[verb] != null) {
                window.Rollbar[verb](...arguments); //eslint-disable-line no-undef
            }
        };
    }
}

Log = new Logger();

export default Log;
