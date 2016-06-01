import React from 'react'; //eslint-disable-line no-unused-vars
import _ from 'lodash';

import History from 'components/history';
import PublicRoutes from 'public_routes';
import EventManager from 'components/event_manager';
import Log from 'components/log';
import Store from 'components/log';
import Util from 'components/util';
import PrivateRoutes from 'private_routes';

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
    var currentUser = {};
    if (Store != null && Store.getState != null) {
        currentUser = Store.getState().currentUser.without(['first_name', 'middle_name', 'last_name']);
    }
    //var redirect = window.setTimeout(function () {
        //History.replace('/profile');
        //window.location.reload();
    //}, 5000);
    //History.listenBefore(() => {
    //    window.clearTimeout(redirect);
    //});
    _errors.push(
        <div id="triggerederror" className="error403"><a href="/profile"> </a></div>
    );
    _.each(_handlers, handler => handler());
    Log.error('displayed 403: ' + url, ...arguments, window.location, currentUser);
    EventManager.update('errorChange', _errors);
};

var show404 = function () {
    var currentUser = {};
    if (Store != null && Store.getState != null) {
        currentUser = Store.getState().currentUser.without(['first_name', 'middle_name', 'last_name']);
    }
    _errors.push(
        <div id="triggerederror" className="error404"><a href="/profile"> </a></div>
    );
    _.each(_handlers, handler => handler());
    Log.error('Displayed 404: ' + window.location.pathname, ...arguments, window.location, currentUser);
    EventManager.update('errorChange', _errors);
};

var show500 = function (url) {
    var currentUser = {};
    var link = '/';
    var state;
    if (Store != null && Store.getState != null) {
        state = Store.getState();
        currentUser = Store.getState().currentUser.without(['first_name', 'middle_name', 'last_name']);
        if (state.currentUser.user_id != null) {
            link = '/profile';
        }
    }
    _errors.push(
        <div id="triggerederror" className="error500"><a href={link} className="gohome"> </a><a onClick={() => window.location.reload()}> </a></div>
    );
    _.each(_handlers, handler => handler());
    Log.error('Displayed 500: ' + url, ...arguments, window.location, currentUser);
    EventManager.update('errorChange', _errors);
};

var showApplication = function (err) {
    var currentUser = {};
    var link = '/';
    var state;
    if (Store != null && Store.getState != null) {
        state = Store.getState();
        currentUser = Store.getState().currentUser.without(['first_name', 'middle_name', 'last_name']);
        if (state.currentUser.user_id != null) {
            link = '/profile';
        }
    }
    _errors.push(
        <div id="triggerederror" className="applicationerror"><a href={link}> </a></div>
    );
    _.each(_handlers, handler => handler());
    Log.error('Displayed Application Error: ' + (err && err.message != null ? err.message : err), ...arguments, window.location, currentUser);
    EventManager.update('errorChange', _errors);
};

var handle401 = function (err) {
    err = err || '';
    if (
        window.location.pathname !== '/' &&
        window.location.pathname !== '/change-password' &&
        _.reduce(PrivateRoutes, (acc, path) =>
            acc ||
            Util.matchPathAndExtractParams(path.path, window.location.pathname) !== false
        , false)
    ) {
        Log.info('User not authenticated, page: ' + window.location.pathname + ' message: ' + (_.isString(err) ? err : err.message));
        if (window.location.pathname !== '/logout' && window.location.pathname !== '/logout/' && window.location.pathname !== '/login' && window.location.pathname !== '/login/') {
            History.push('/logout');
        }
    }
};

var onError = function (callback) {
    _handlers.push(callback);
};

var clearErrors = function () {
    _errors = [];
    EventManager.update('errorChange', _errors);
};

var handlePageErrors = function (res) {
    if (res.status === 401) {
        //are we unauthorized because we need to update our password?
        if (res.response && res.response.detail.toLowerCase() === 'change password') {
            if (!~window.location.href.indexOf('change-password')) {
                History.push('/change-password');
            }
            return;
        }
        if (!PublicRoutes.hasPath(window.location.pathname)) {
            //if we have encountered an unauthorized user, we want to cancel all
            //further requests until the user can be fully logged out
            window.__USER_UNAUTHORIZED = true;
            //force user to login screen on any 401, via the logout, regardless of access pattern
            handle401();
            return;
        }
    }

    if (window.location.pathname === '/login' || window.location.pathname === '/logout') {
        //don't display errors occuring during login and logout, they are handled separately
        return;
    }

    if (res.request.handlePageLevelErrors !== true && res.status > 399) {
        //defer error handling to component
        throw {message: 'Server Error', response: res};
    }

    if (res.request.method !== 'GET') {
        //This should not be reached, but if by some misconfiguration it is, do not display errors to the user
        Log.warn('Non GET request attempted to display page level error');
        return;
    }

    if (res.status > 499) {
        show500(res.request.url, res);
    } else if (res.status === 403) {
        show403(res.request.url, res);
    } else if (res.status === 404) {
        show404(res.request.url, res);
    } else if (res.status > 399) {
        showApplication(res);
    } else if (res.status === 0 || res.response == null || res.response.length === 0 && res.request.url.indexOf('logout') === -1) {
        showApplication(res);
        throw 'Invalid status (' + res.status + ') or corrupt/empty data recieved from ' + res.request.url;
    }
};

//make sure these clear when the back button is hit
window.onpopstate = clearErrors;

export default {renderErrors, handle401, show403, show404, show500, showApplication, onError, clearErrors, handlePageErrors};

