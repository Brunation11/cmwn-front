import React from 'react'; //eslint-disable-line no-unused-vars
import _ from 'lodash';

import History from 'components/history';
import EventManager from 'components/event_manager';

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

var show404 = function () {
    _errors.push(
        <div id="triggerederror"><a href="/login"> </a></div>
    );
    _.each(_handlers, handler => handler());
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

export default {renderErrors, show404, onError, clearErrors};

