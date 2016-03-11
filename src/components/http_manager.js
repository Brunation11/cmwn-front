/**
 * http_manager.js
 * A lightweight wrapper to XHR. Singlton.  Takes a single or array of http request config
 * objects and returns a promise containing a matching set of responses
 */
import _ from 'lodash';
//import Cookie from 'cookie';

import History from 'components/history';
import Errors from 'components/errors';
import Log from 'components/log';
import PublicRoutes from 'public_routes';

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
    if (window.__USER_UNAUTHORIZED) {
        return Promise.resolve({data: []});
    }
    request = _makeRequestObj(request, body, headers);
    if (!_.isArray(request)) {
        request = [request];
    }
    promise = _makeRequest.call(this, method, request);
    if (request.length === 1) {
        return promise.then((res) => {
            if (res[0].status === 401) {
                //are we unauthorized because we need to update our password?
                if (res[0].response && res[0].response.error && res[0].response.error.code === 'RESET_PASSWORD') {
                    return Promise.resolve(res[0]);
                }
                if (!PublicRoutes.hasPath(window.location.pathname)) {
                    //if we have encountered an unauthorized user, we want to cancel all
                    //further requests until the user can be fully logged out
                    window.__USER_UNAUTHORIZED = true;
                    //force user to login screen on any 401, via the logout, regardless of access pattern
                    //History.replace('/logout');
                }
            }

            if (window.location.pathname === '/login' || window.location.pathname === '/logout') {
                //don't display errors occuring during login and logout, they are handled separately
                return Promise.resolve(res[0]);
            }

            if (request[0].handleErrors === false && res[0].status > 399) {
                throw 'Server error.';
            }

            if (res[0].status > 499) {
                //Errors.show500(request[0].url, res);
            } else if (res[0].status === 403) {
                //Errors.show403(request[0].url, res);
            } else if (res[0].status === 404) {
                //Errors.show404(request[0].url, res);
            } else if (res[0].status > 399) {
                //Errors.showApplication(res);
            } else if (res[0].status === 0 || res[0].response == null || res[0].response.length === 0 && request[0].url.indexOf('logout') === -1) {
                throw 'no data recieved from ' + request[0].url;
            }
            return Promise.resolve(res[0]);
        }).catch(err => {
            if (request[0].handleErrors === false || method !== 'GET') { //assume non-gets are not navigational
                return Promise.reject(err);
            } else {
                //Errors.showApplication(err, request);
            }
        });
    }
    return promise;
};

var _makeRequest = function (verb, requests){
    var isIe9 = !!~document.getElementsByTagName('html')[0].className.indexOf('ie9');
    var promises = _.map(requests, req => {
        var abort;
        var promise = new Promise((res, rej) => {
            var xhr = new XMLHttpRequest();
            var url, body;
            abort = () => { //Promise constructor does not expose `this`, must attach outside
                xhr.abort();
                res(null);
            };
            try {
                xhr.onreadystatechange = () => {
                    var response;
                    if (xhr.readyState !== 4) {
                        return;
                    }
                    try {
                        response = (_.isObject(xhr.response) ? xhr.response : JSON.parse(xhr.response));
                    } catch(err) {
                        response = xhr.response;
                        Log.info(err, 'recieved non-standard data format from api');
                    }
                    return res({
                        url,
                        status: xhr.status,
                        response,
                        request: xhr
                    });
                };
                //if (!req.withoutToken && this._token != null && verb === 'GET') {
                //    if (req.url.indexOf('?') === -1) {
                //        req.url += `?_token=${this._token}`;
                //    } else {
                //        req.url += `&_token=${this._token}`;
                //    }
                //}


                url = req.url;

                xhr.open(verb, url, true);

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
                if (req.asFormData) {
                    req.body = _.reduce(req.body, (acc, val, key) => {
                        acc.append(key, val);
                        return acc;
                    }, new FormData());
                } else {
                    req.body = JSON.stringify(req.body);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                }
                //ie9 dislikes these events being undefined
                xhr.onload = _.noop;
                xhr.onprogress = _.noop;
                xhr.ontimeout = _.noop;
                xhr.onerror = _.noop;
                //timeout handles issue where ie9 will fail requests instantaneously on blocked thread
                setTimeout(function () {
                    if (verb.toLowerCase() === 'get') {
                        xhr.send();
                    } else if (!isIe9) {
                        xhr.send(req.body);
                    } else {
                        /** @TODO MPR, 1/13/16: This is not the ideal way to handle this.*/
                        body = _.reduce(req.body, (a, v, k) => {
                            a += window.encodeURIComponent(k) + '=' + window.encodeURIComponent(v) + '&';
                            return a;
                        }, '');
                        xhr.send(body);
                    }
                }, 0);
            } catch(err) {
                rej(err);
                Log.error(err, 'Unhandled http request error');
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

