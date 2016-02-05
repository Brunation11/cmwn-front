/* eslint-disable no-console, no-debugger*/
import GLOBALS from 'components/globals';

class Logger {
    constructor() {
        console.log('logger init');
        this.info = this.write('info', 'User Action', '#d0e2ec');
        this.log = this.write('log', 'System', '#bfe2ca');
        this.warn = this.write('warn', 'Warning', '#fed88f');
        this.error = function () {
            this.write('error', 'Error', '#f4858e')(...arguments);
            if (GLOBALS.MODE.toLowerCase() === 'local' || GLOBALS.MODE.toLowerCase() === 'dev' || GLOBALS.MODE.toLowerCase() === 'development') {
                if (GLOBALS.debugging === true || window.debugging === true || this.debugging === true) {
                    debugger;
                }
            }
        };
    }
    write(verb, label, color) {
        return function () {
            console.log('logger called', ...arguments);
            if (GLOBALS.MODE.toLowerCase() === 'local' || GLOBALS.MODE.toLowerCase() === 'dev' || GLOBALS.MODE.toLowerCase() === 'development') {
                console[verb](`%c ${label}: `, `color: ${color};`, ...arguments);
            }
            Rollbar[verb](...arguments); //eslint-disable-line no-undef
        };
    }
}

var Log = new Logger();

export default Log;
