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
        this.historyStack.push(this.createLocation(location));
        this.currentIndex++;
    }

    replace(location) {
        this.historyStack.pop();
        this.historyStack.push(this.createLocation(location));
        this.currentIndex += this.currentIndex < 0 ? 1 : 0;
    }

    createLocation(location) {
        var a;

        if (typeof location === 'string') {
            a = document.createElement('a');
            a.href = location;

            return {
                pathname: a.pathname,
                query: this.parseSearch(a.search),
                hash: a.hash,
                state: null,
                search: a.search
            };
        } else if (typeof location === 'object' && location.pathname) {
            return {
                pathname: location.pathname,
                query: location.query || {},
                hash: location.hash || '',
                state: location.state || null,
                search: location.search || ''
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
        if (search.length > 1) {
            pairs = search.substring(1).split('&');
            _.forEach(pairs, pair => {
                // split at first index of '=' in case value has the character too
                var parts = this.splitAtIndex(pair.indexOf('='));
                if (parts.length === 1 && parts[0]) {
                    query[parts[0]] = null;
                } else if (parts.length === 2 && parts[0]) {
                    query[parts[0]] = parts[1];
                }
            });
        }
        return query;
    }

    // split string at given index and return both parts as array
    splitAtIndex(s, n) {
        if (n < 0 || n >= s.length) {
            return [s];
        } else {
            return [s.substring(0, n), s.substring(n + 1)];
        }
    }

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
