/* eslint-disable no-console, no-debugger*/
import GLOBALS from 'components/globals';

class Logger {
    constructor() { }
    info() {
        if (GLOBALS.MODE.toLowerCase() === 'dev' || GLOBALS.MODE.toLowerCase() === 'development') {
            console.info(...arguments);
        }
    }
    log() {
        if (GLOBALS.MODE.toLowerCase() === 'dev' || GLOBALS.MODE.toLowerCase() === 'development') {
            console.log(...arguments);
        }
    }
    warn() {
        if (GLOBALS.MODE.toLowerCase() === 'dev' || GLOBALS.MODE.toLowerCase() === 'development') {
            console.warn(...arguments);
        }
    }
    error() {
        if (GLOBALS.MODE.toLowerCase() === 'dev' || GLOBALS.MODE.toLowerCase() === 'development') {
            console.error(...arguments);
            if (GLOBALS.debugging === true || window.debugging === true || this.debugging === true) {
                debugger;
            }
        }
    }
}

var Log = new Logger();

export default Log;
