import React from 'react'; //eslint-disable-line no-unused-vars
import _ from 'lodash';

import History from 'components/history';
import EventManager from 'components/event_manager';
import Log from 'components/log';
import Authorization from 'components/authorization';

var _errors = [];
var _handlers = [];

var renderErrors = function () {
    History.listenBeforeUnload(() => {
        _errors = [];
        EventManager.update('errorChange', _errors);
    });
    return (
        <div>
            {_errors}
        </div>
    );
};

var show403 = function () {
    _errors.push(
        <div id="triggerederror 403Error"><a href="/profile"> </a></div>
    );
    _.each(_handlers, handler => handler());
    Log().error('displayed 403', window.location, Authorization.currentUser);
    EventManager.update('errorChange', _errors);
};

var show404 = function () {
    _errors.push(
        <div id="triggerederror 404Error"><a href="/profile"> </a></div>
    );
    _.each(_handlers, handler => handler());
    Log().error('Displayed 404', window.location, Authorization.currentUser);
    EventManager.update('errorChange', _errors);
};

var show500 = function () {
    _errors.push(
        <div id="triggerederror 500Error"><a href="/profile"> </a></div>
    );
    _.each(_handlers, handler => handler());
    Log().error('Displayed 500', window.location, Authorization.currentUser);
    EventManager.update('errorChange', _errors);
};

var showApplication = function () {
    _errors.push(
        <div id="triggerederror applicationError"><a href="/profile"> </a></div>
    );
    _.each(_handlers, handler => handler());
    Log().error('Displayed Application Error', window.location, Authorization.currentUser);
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

