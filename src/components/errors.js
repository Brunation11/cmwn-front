import React from 'react'; //eslint-disable-line no-unused-vars
import _ from 'lodash';

import History from 'components/history';

var _errors = [];
var _handlers = [];

var renderErrors = function () {
    History.listenBeforeUnload(() => {
        _errors = [];
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
};

var onError = function (callback) {
    _handlers.push(callback);
};

export default {renderErrors, show404, onError};

