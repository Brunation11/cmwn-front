/**
 * eventManager.js
 * Singleton. Maintains a list of pending changes to a global weakMap
 * As such, it is not mandatory to keep track of registered values.
 * However, a .dispose method is provided to streamline this process.
 * Upon initilaization, the manager listens for calls to update
 * and combines updates provided by these events, issuing changes
 * no more often than once every 17ms.
 */
import _ from 'lodash';

var _pendingChanges = [];
var _state = {};
var _pendingChangeTracker = {};
var _changeHandlers = {};

const UPDATE_THROTTLE = 17; //60 FPS should be sufficent

/**
 * Predicate. Checks if two collections share references to all items/properties
 */
var eqByCollection = function (a, b) {
    if (a.length !== b.length){
        //avoid the loop if we can
        return false;
    }
    return _.reduce(a, (acc, item, key) => (
        acc &&
        typeof b[key] !== 'undefined' &&
        item === b[key]
    ));
};

/**
 * Private method of _EventManager. Must always be called with .call(this, ...) or .apply(this, ...)
 * Consumes the current list of pending changes
 */
var _commitChanges = function (id) {
    if (this.pendingCount === 0 || _pendingChangeTracker[id] == null) {
        return; //deferred change was commited by an earlier event. We're done.
    }
    _pendingChangeTracker = {}; //empty pending changes;
    _.each(_pendingChanges, change => {
        var handlers;
        try {
            change.resolver(true);
            _.set(_state, change.key, change.val);
            handlers = _.get(_changeHandlers, change.key);
            _.each(handlers, handle => handle(change.val));
        } catch(err) {
            change.resolver(err);//we resolve here to allow other changes to continue updating.
        }
    });
    _pendingChanges = [];
};

class _EventManager {
    constructor() {
        this.lastUpdate = Date.now();
    }
    /**
     * Pushes a change onto the change stack
     * @param {string} key - the key of the object to update. Can be a nested path, as with _.get
     * @param {*} val the value to update
     * @param {string|number} [scopeHandle = 'global'] - unique identifier for individual component scopes. If a number is passed as this parameter, it will be treated as the depth parameter and the final param will be ignored. 'global' should be passed for multi-scope components.
     * @param {number} [depth = 0] - how closely to compare objects.
     * 0 = shallow. Default, and always used for value types. (top level by Reference)
     * 1 = by collection. Checks inside arrays and object properties by reference
     * 2 = deep. Checks against values.
     */
    update(key, val, scopeHandle = 'global', depth = 0) {
        var now = Date.now();
        var bypass, oldVal, promise, resolver;

        if (_.isNumber(scopeHandle)) {
            depth = scopeHandle;
            scopeHandle = 'global';
        }
        oldVal = _.get(_state, `${scopeHandle}.${key}`);
        if (oldVal == null) {
            bypass = true;
        } else {
            bypass = _.reduce(_pendingChanges, (acc, change) => (acc || change.key === `${scopeHandle}.${key}`)); //checking equality on all pending changes is impractical. Push the update if the current key exists in changes already
        }
        if (_.isNumber(val) || _.isString(val) || _.isBoolean(val)) {
            depth = 0;
        }

        if (
            bypass ||
            (depth === 0 && oldVal !== val) ||
            (depth === 1 && !eqByCollection(oldVal, val)) ||
            (depth === 2 && _.eq(oldVal, val))
        ) {
            promise = new Promise((resolve) => {
                resolver = resolve;
            });
            _pendingChangeTracker[`${scopeHandle}.${key}`] = true;
            _pendingChanges.push({
                id: now + `${scopeHandle}.${key}`,
                key: `${scopeHandle}.${key}`,
                val: val,
                promise,
                resolver
            });
            if (now - this.lastUpdate > UPDATE_THROTTLE) {
                _commitChanges.call(this, `${scopeHandle}.${key}`);
            } else {
                window.setTimeout(() => {
                    _commitChanges.call(this, `${scopeHandle}.${key}`);
                }, UPDATE_THROTTLE - (now - this.lastUpdate));
            }
        }
    }
    get(key, scopeHandle = 'global'){
        return _.get(_state, `${scopeHandle}.${key}`);
    }
    listen(key, callback, scopeHandle = 'global') {
        var handlers = _.get(_changeHandlers, `${scopeHandle}.${key}`) || [];
        handlers.push(callback);
        _.set(_changeHandlers, `${scopeHandle}.${key}`, handlers);
    }
    dispose(scopeHandle) { //eslint-disable-line no-unused-vars
        /** TODO: MPR, 11/3/15: Implement Dispose */
    }
    get pendingCount() {
        return _pendingChanges.lenght;
    }
}

var EventManager = new _EventManager();

export default EventManager;

