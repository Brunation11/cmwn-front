import React from 'react'; //eslint-disable-line no-unused-vars
import _ from 'lodash';

import History from 'components/history';
import EventManager from 'components/event_manager';
import Log from 'components/log';
import Authorization from 'components/authorization';

var _errors = [];
var _handlers = [];

var renderErrors = function () {
    History.listenBefore(() => {
        _errors = [];
        EventManager.update('errorChange', _errors);
    });
    return (
        <div>
            {_errors}
        </div>
    );
};

var show403 = function (url) {
    var redirect = window.setTimeout(function () {
        History.replace('/profile');
        window.location.reload();
    }, 5000);
    History.listenBefore(() => {
        window.clearTimeout(redirect);
    });
    _errors.push(
        <div id="triggerederror" className="error403"><a href="/profile"> </a></div>
    );
    _.each(_handlers, handler => handler());
    Log.error('displayed 403: ' + url, ...arguments, window.location, Authorization.currentUser);
    EventManager.update('errorChange', _errors);
};

var show404 = function () {
    _errors.push(
        <div id="triggerederror" className="error404"><a href="/profile"> </a></div>
    );
    _.each(_handlers, handler => handler());
    Log.error('Displayed 404: ' + window.location.pathname, ...arguments, window.location, Authorization.currentUser);
    EventManager.update('errorChange', _errors);
};

var show500 = function (url) {
    _errors.push(
        <div id="triggerederror" className="error500"><a href="/profile" className="gohome"> </a><a onClick={() => window.location.reload()}> </a></div>
    );
    _.each(_handlers, handler => handler());
    Log.error('Displayed 500: ' + url, ...arguments, window.location, Authorization.currentUser);
    EventManager.update('errorChange', _errors);
};

var showApplication = function (err) {
    _errors.push(
        <div id="triggerederror" className="applicationerror"><a href="/profile"> </a></div>
    );
    _.each(_handlers, handler => handler());
    Log.error('Displayed Application Error: ' + (err && err.message != null ? err.message : err), ...arguments, window.location, Authorization.currentUser);
    EventManager.update('errorChange', _errors);
};

var onError = function (callback) {
    _handlers.push(callback);
};

var clearErrors = function () {
    _errors = [];
    EventManager.update('errorChange', _errors);
};

//make sure these clear when the back button is hit
window.onpopstate = clearErrors;

export default {renderErrors, show403, show404, show500, showApplication, onError, clearErrors};

