/* eslint-disable no-console, no-debugger*/
import GLOBALS from 'components/globals';

class Logger {
    constructor() { }
    info() {
        if (GLOBALS.MODE.toLowerCase() === 'dev' || GLOBALS.MODE.toLowerCase() === 'development') {
            console.info(...arguments);
        }
        trackJs.console.info(...arguments); //eslint-disable-line no-undef
    }
    log() {
        if (GLOBALS.MODE.toLowerCase() === 'dev' || GLOBALS.MODE.toLowerCase() === 'development') {
            console.log(...arguments);
        }
        trackJs.console.log(...arguments); //eslint-disable-line no-undef
    }
    warn() {
        if (GLOBALS.MODE.toLowerCase() === 'dev' || GLOBALS.MODE.toLowerCase() === 'development') {
            console.warn(...arguments);
        }
        trackJs.console.warn(...arguments); //eslint-disable-line no-undef
    }
    error() {
        if (GLOBALS.MODE.toLowerCase() === 'dev' || GLOBALS.MODE.toLowerCase() === 'development') {
            console.error(...arguments);
            if (GLOBALS.debugging === true || window.debugging === true || this.debugging === true) {
                debugger;
            }
        }
        trackJs.console.error(...arguments); //eslint-disable-line no-undef
    }
}

var Log = new Logger();

export default Log;
