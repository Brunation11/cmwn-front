import _ from 'lodash';

class History {
    constructor() {
        this.historyStack = [];
        this.currentIndex = -1;
    }

    go(n) {
        var nextIndex = this.currentIndex + n;
        if (nextIndex > -1 && nextIndex < this.historyStack.length) {
            this.currentIndex = nextIndex;
        } else {
            throw new Error(`moving ${n} to ${nextIndex} is not within the current history size of ` +
                this.historyStack.length);
        }
    }

    goBack() {
        this.go(-1);
    }

    goForward() {
        this.go(1);
    }

    push(location) {
        var newLoc = this.createLocation(location);
        if (!_.isEqual(newLoc, this.getCurrentLocation())) {
            this.historyStack.push(newLoc);
            this.currentIndex++;
        }
    }

    replace(location) {
        this.historyStack.pop();
        this.currentIndex -= this.currentIndex < 0 ? 0 : 1;
        this.push(location);
    }

    createLocation(location) {
        var url;

        if (typeof location === 'string') {
            url = new URL(location, 'http://www.example.com');

            return {
                pathname: url.pathname,
                query: this.parseSearch(url.search),
                hash: url.hash,
                state: null,
                search: url.search
            };
        } else if (location && typeof location === 'object' && _.isString(location.pathname)) {
            return {
                pathname: location.pathname,
                query: this.parseSearch(_.isString(location.search) ? location.search : ''),
                hash: _.isString(location.hash) ? location.hash : '',
                search: _.isString(location.search) ? location.search : '',
                state: location.state || null
            };
        } else {
            throw new Error('not a properly formatted location, provide path string or ' +
                'LocationDescriptorObject');
        }
    }

    // extract the search paramaters and values
    parseSearch(search) {
        var query = {};
        var pairs = [];
        var isString = _.isString(search);
        search = isString ? search.substring(search.indexOf('?') + 1) : search;
        search = isString && search.indexOf('&') === 0 ? search.substring(1) : search;
        if (isString && search.length > 0) {
            pairs = search.split('&');
            _.forEach(pairs, pair => {
                // split at first index of '=' in case value has the character too
                var parts = this.splitAtIndex(pair, pair.indexOf('='));
                var value;
                if (!_.isUndefined(parts[0]) && !_.isNull(parts[0])) {
                    value = parts.length === 2 ? parts[1] : null;
                }

                // concat the values if there is already a value associated with the key
                if (value !== undefined) {
                    if (query[parts[0]] !== undefined) {
                        query[parts[0]] = [].concat(query[parts[0]]).concat(value);
                    } else {
                        query[parts[0]] = value;
                    }
                }
            });
        }
        return query;
    }

    // split string at given index and return both parts as array
    splitAtIndex(s, n) {
        if (_.isString(s) || _.isNull(s) || _.isUndefined(s) || _.isNumber(s)) {
            s = _.toString(s);
            if (_.isNumber(n) && n > -1 && n < s.length) {
                return [s.substring(0, n), s.substring(n + 1)];
            } else {
                return [s];
            }
        }
        return undefined;
    }

    // good reference for history methods in node_modules/react-router/umd/reactRouter.js

    /*
    listen(listener) {

    }

    listenBefore(listener) {

    }

    transitionTo(location) {

    }

    createHref(location, query) {

    }

    createKey() {

    }

    createPath(location, query) {

    }*/

    // unsubsribe method is normally used to destroy internal listeners from sync

    /*
    unsubscribe() {
    }

    // deprecated methods
    pushState() {

    }

    replaceState() {

    }

    setState() {

    }

    registerTransitionHook(hook) {

    }

    unregisterTransitionHook(hook) {

    }*/

    // Methods for mock purposes
    getCurrentLocation() {
        return this.historyStack[this.currentIndex] || null;
    }

    getCurrentSize() {
        return this.historyStack.length;
    }

    getLocation(n) {
        return this.historyStack[n];
    }
}

export default History;
