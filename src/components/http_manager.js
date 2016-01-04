/**
 * http_manager.js
 * A lightweight wrapper to XHR. Singlton.  Takes a single or array of http request config
 * objects and returns a promise containing a matching set of responses
 */
import _ from 'lodash';
//import Cookie from 'cookie';

import History from 'components/history';
import Errors from 'components/errors';

const APP_COOKIE_NAME = 'cmwn_token';

/**
 * Bundles requests into an array of request objects
 * @param {array|string|object} requests - arrays will have makeRequestObj on each of their items, strings will be set to the url of a new request object.
 * @param {object} [headers] - the headers to be sent with requests. If you need
 * each to have different headers, configure the .headers property of individual
 * request objects
 * @param {string|object} [body] - request info. Should be a properly formatted JSON
 * or query string
 * @returns {array|object} - returns an array when an array is passed in, otherwise a request object
 */
var _makeRequestObj = function (requests, body = '', headers = {}) {
    if (_.isArray(requests)) {
        requests = _.map(requests, req => _makeRequestObj(req, body, headers));
    } else if (_.isString(requests)) {
        requests = {url: requests, body, headers};
    }
    if (_.isObject(requests) && !_.isArray(requests) && requests.headers == null) {
        requests.headers = headers;
    }
    if (_.isObject(requests) && !_.isArray(requests) && requests.body == null) {
        requests.body = body;
    }
    return requests;
};

var _getRequestPromise = function (method, request, body, headers) {
    var promise;
    request = _makeRequestObj(request, body, headers);
    if (!_.isArray(request)) {
        request = [request];
    }
    promise = _makeRequest.call(this, method, request);
    if (request.length === 1) {
        return promise.then((res) => {
            if (res[0].status > 499) {
                /** @TODO MPR, 12/2/15: Implement catastrophic error page */
                console.error('Unrecoverable server error.'); //eslint-disable-line no-console
            } else if (res[0].status === 401) {
                History.replaceState(null, '/login');
            } else if (res[0].status === 403) {
                /** @TODO MPR, 11/18/15: Implement error page */
                History.replaceState(null, '/profile');
            } else if (res[0].status === 404) {
                Errors.show404();
            } else if (res[0].status > 399) {
                /** @TODO MPR, 11/18/15: Implement error page */
                History.replaceState(null, '/profile');
            } else if (res[0].status === 0 || res[0].response == null || res[0].response.length === 0 && request[0].url.indexOf('logout') === -1) {
                throw 'no data recieved';
            }
            return Promise.resolve(res[0]);
        }).catch(err => {
            if (request[0].handleErrors === false || method !== 'GET') {//assume non-gets are not navigational
                return Promise.reject(err);
            } else {
                console.info(err); //eslint-disable-line no-console
                Errors.show404();
                //Unhandled API error probably indicates a failed preflight with no status, treat as
                //if the user is unauthenticated and redirect to login
                //History.replaceState(null, '/login');
            }
        });
    }
    return promise;
};

var _makeRequest = function (verb, requests){
    var promises = _.map(requests, req => {
        var abort;
        var promise = new Promise((res, rej) => {
            var xhr = new XMLHttpRequest();
            abort = () => { //Promise constructor does not expose `this`, must attach outside
                xhr.abort();
                res(null);
            };
            try{
                xhr.onreadystatechange = () => {
                    var response;
                    if (xhr.readyState !== 4) {
                        return;
                    }
                    try {
                        response = (_.isObject(xhr.response) ? xhr.response : JSON.parse(xhr.response));
                    } catch (err) {
                        response = xhr.response;
                    }
                    return res({
                        status: xhr.status,
                        response,
                        request: xhr
                    });
                };
                if (!req.withoutToken && this._token != null && verb === 'GET') {
                    if (req.url.indexOf('?') === -1) {
                        req.url += `?_token=${this._token}`;
                    } else {
                        req.url += `&_token=${this._token}`;
                    }
                }
                xhr.open(verb, req.url, true);

                xhr.withCredentials = true;
                _.each(req.headers, (header, key) => {
                    xhr.setRequestHeader(key, header);
                });
                if (!req.withoutXSRF && this._token != null) {
                    xhr.setRequestHeader('X-CSRF-TOKEN', this._token);
                }
                if (_.isObject(req.body)) {
                    req.body = (_.defaults({_token: this._token}, req.body));
                }
                if (req.asJSON) {
                    req.body = JSON.stringify(req.body);
                } else {
                    /** @TODO MPR, 11/19/15: Polyfill formdata*/
                    req.body = _.reduce(req.body, (acc, val, key) => {
                        acc.append(encodeURIComponent(key), encodeURIComponent(val));
                        return acc;
                    }, new FormData());
                }
                xhr.send(req.body);
            } catch (err) {
                rej(err);
            }
        });
        promise.abort = abort;
        return promise;
    });
    var promise = Promise.all(promises);
    promise.abort = () => _.each(promises, p => p.abort);
    return promise;
};

class _HttpManager {
    constructor() {
        var csrf = window.localStorage[APP_COOKIE_NAME];
        if (csrf != null) {
            this.setToken(csrf);
        }
    }
    GET(request, body, headers){
        return _getRequestPromise.call(this, 'GET', request, body, headers);
    }
    POST(request, body, headers){
        return _getRequestPromise.call(this, 'POST', request, body, headers);
    }
    PUT(request, body, headers){
        return _getRequestPromise.call(this, 'PUT', request, body, headers);
    }
    DELETE(request, body, headers){
        return _getRequestPromise.call(this, 'DELETE', request, body, headers);
    }
    setToken(_token) {
        this._token = _token;
        window.localStorage.setItem(APP_COOKIE_NAME, _token);
    }
    get token() {
        return this._token;
    }
}

var HttpManager = new _HttpManager();

export default HttpManager;

