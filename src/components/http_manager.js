/**
 * http_manager.js
 * A lightweight wrapper to XHR. Singlton.  Takes a single or array of http request config
 * objects and returns a promise containing a matching set of responses
 */
import _ from 'lodash';


var _makeRequest = function(verb, requests){
    var promises = _.map(requests, req => {
        return new Promise((res, rej) => {
            var xhr = new XMLHttpRequest();
            this.abort = () => {
                xhr.abort();
                res(null);
            }
            try{
                xhr.onreadystatechange = () => {
                    if (xhr.readyState !== 4) {
                        return;
                    }
                    return res({
                        status: xhr.status,
                        response: xhr.response,
                        request: xhr
                    });
                }
                xhr.open(verb, req.url, true);
                xhr.send();
            } catch (err) {
                rej(err);
            }
        });
    });
    var promise = Promise.all(promises);
    promise.abort = () => _.each(promises, p => p.abort);
    return promise;
};

class _HttpManager {
    constructor() {
        
    }
    GET(request){
        var promise;
        if (_.isObject(request)) {
            request = [request];
        };
        promise = _makeRequest('GET', request);
        if (request.length === 1) {
            return promise.then(res => Promise.resolve(res[0]));
        }
        return promise;
    }
    POST(request){
    }
    PUT(request){
    }
    DELETE(){
    }
};

var HttpManager = new _httpManager();

export default HttpManager;

