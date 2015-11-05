/**
 * http_manager.js
 * A lightweight wrapper to XHR. Singlton.  Takes a single or array of http request config
 * objects and returns a promise containing a matching set of responses
 */
import _ from 'lodash';

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
    promise = _makeRequest(method, request);
    if (request.length === 1) {
        return promise.then(res => Promise.resolve(res[0]));
    }
    return promise;
};

var _makeRequest = function(verb, requests){
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
                    debugger;
                    if (xhr.readyState !== 4) {
                        return;
                    }
                    try {
                        response =  (_.isObject(xhr.response) ? xhr.response : JSON.parse(xhr.response));
                    } catch (err) {
                        response = xhr.response;
                    }
                    return res({
                        status: xhr.status,
                        response,
                        request: xhr
                    });
                };
                xhr.open(verb, req.url, true);
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
    }
    GET(request, headers){
        return _getRequestPromise('GET', request, headers);
    }
    POST(request, headers){
        return _getRequestPromise('POST', request, headers);
    }
    PUT(request, headers){
        return _getRequestPromise('PUT', request, headers);
    }
    DELETE(request, headers){
        return _getRequestPromise('DELETE', request, headers);
    }
}

var HttpManager = new _HttpManager();

export default HttpManager;

