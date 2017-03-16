import _ from 'lodash';

import Actions from 'components/actions';
import Store from 'components/store';
import Log from 'components/log';
import GLOBALS from 'components/globals';
import EventManager from 'components/event_manager';
import LocalStorage from 'components/local_storage';

var Util = {
    /* Binds the context to the given list of functions in a component*/
    autobind: function (self, functionNames) {
        _.each(functionNames, (key) => {
            var func = self[key];
            if (_.isFunction(func)) {
                self[key] = function () { return func.apply(self, arguments); };
            } else {
                Log.warn('Looks like there is a typo in function name ' + key + '! Get some caffeine.');
            }
        });
    },
    setPageTitle: function (text) {
        var titleElem;
        var title;
        if (!_.isString(text)) text = 'Change My World Now';
        titleElem = document.getElementsByTagName('title')[0];
        title = document.createTextNode(text);
        if (titleElem == null) {
            titleElem = document.createElement('title');
            document.getElementsByTagName('head')[0].appendChild(titleElem);
        }
        while (titleElem && titleElem.lastChild) {
            titleElem.removeChild(titleElem.lastChild);
        }
        titleElem.appendChild(title);
    },
    /* logic pulled from the react-router source with the non-basic route types removed*/
    matchPathAndExtractParams(route, path) {
        var routeArray;
        var pathArray;
        var params = {};
        var routePart;
        var pathPart;
        if (!_.isString(route) || !_.isString(path)) {
            return false;
        }
        route = route.toLowerCase().replace('(', '').replace(')', '');
        path = path.toLowerCase();
        if (route.slice(-1) === '/') {
            route = route.slice(0, -1);
        }
        if (route.slice(0, 1) === '/') {
            route = route.slice(1);
        }
        if (path.slice(-1) === '/') {
            path = path.slice(0, -1);
        }
        if (path.slice(0, 1) === '/') {
            path = path.slice(1);
        }
        routeArray = route.split('/');
        pathArray = path.split('/');
        if (routeArray.length !== pathArray.length) {
            return false;
        }
        while (routeArray.length) {
            routePart = routeArray.pop();
            pathPart = pathArray.pop();
            if (~routePart.indexOf(':')) {
                params[routePart.slice(1)] = pathPart;
            } else {
                if (routePart.toLowerCase() !== pathPart.toLowerCase()) {
                    return false;
                }
            }
        }
        return params;
    },
    replacePathPlaceholdersFromParamObject(route, params) {
        var routeArray;
        var routePart;
        var path = '';
        if (!_.isString(route)) {
            throw 'Path could not be constructed; Expected route to be a string.';
        }
        routeArray = route.split('/');
        while (routeArray.length) {
            routePart = routeArray.shift();
            if (routePart === '') {
                continue;
            } else if (!~routePart.indexOf(':')) {
                path += routePart + '/';
            } else if (_.isObjectLike(params) && routePart.slice(1) in params) {
                path += params[routePart.slice(1)] + '/';
            } else {
                throw 'Path could not be constructed; Expected parameter was not passed.';
            }
        }
        return path.slice(0, -1);
    },
    getLinkFromPageFallbackToCurrentUser(state, endpointIdentifier) {
        var endpoint;
        if (!state) return endpoint;
        if (
            state.page &&
            state.page.data &&
            state.page.data._links &&
            state.page.data._links[endpointIdentifier] != null
        ) {
            endpoint = state.page.data._links[endpointIdentifier].href;
        } else if (state.currentUser &&
            state.currentUser._links &&
            state.currentUser._links[endpointIdentifier] != null
        ) {
            /* @TODO MPR, 3/22/16: This conditional should not exist, and only is here as a stopgap
             * while the me endpoint does not
             * exactly match the authenticated / endpoint. */
            /* @TODO MPR, 11/17/16: Then again... */
            endpoint = state.currentUser._links[endpointIdentifier].href;
        }
        return endpoint;
    },
    linkIsPresentInUserOrPage(state, endpointIdentifier) {
        return Util.getLinkFromPageFallbackToCurrentUser(state, endpointIdentifier) != null;
    },
    attemptComponentLoad(state, endpointIdentifier, componentName) {
        if (state.pageLoadingStage.lastCompletedStage !== GLOBALS.PAGE_LOAD_STATE.COMPONENT ||
            state.components[endpointIdentifier + '-' + componentName].requested) {
            return;
        }
        switch (state.pageLoadingStage.currentStage) {
            case GLOBALS.PAGE_LOAD_STATE.COMPONENT: // This always needs to come after page load
                Store.dispatch({
                    type: 'combo',
                    types: ['COMPONENT_LOADER_START', 'LOADER_SUCCESS', 'LOADER_ERROR'],
                    sequence: true,
                    payload: [
                        Actions.COMPONENT_REQUESTED.bind(null, {endpointIdentifier, componentName} ),
                        Actions.COMPONENT_DATA.bind(null, endpointIdentifier, componentName)
                    ]
                });
                break;
        }
    },
    decodePermissions(val) {
        var perms = {
            create: false, update: false, delete: false
        };
        var pad = '0000';
        var bits;
        if (val === -1) {
            perms = {
                create: true, update: true, delete: true
            };
        } else if (val > 0 && val < 8) {
            bits = (val >>> 0).toString(2);
            bits = pad.substring(0, pad.length - bits.length) + bits;
            perms = {
                create: !!+bits.slice(-3, -2),
                update: !!+bits.slice(-2, -1),
                delete: !!+bits.slice(-1)
            };
        }
        return perms;
    },
    logout() {
        LocalStorage.setItem('com.cmwn.platform.userName', null);
        LocalStorage.setItem('com.cmwn.platform.userId', null);
        LocalStorage.setItem('com.cmwn.platform.profileImage', null);
        LocalStorage.setItem('com.cmwn.platform.roles', null);
        LocalStorage.setItem('com.cmwn.platform._links', null);
        Actions.dispatch.LOGOUT();
        Log.info('User logout successful');
        EventManager.update('userChanged', null);
    },
    formatString() {
        var args = Array.prototype.slice.call(arguments);
        var templateString = args.shift();
        var extraneousArgs = false;
        if (!_.isString(templateString)) throw 'First argument must be a string.';
        _.each(args, (arg, k) => {
            if (!~templateString.indexOf('{' + k + '}')) extraneousArgs = true;
            templateString = templateString.replace('{' + k + '}', arg);
        });
        if (~templateString.search(/{[0-9]+}/)) throw 'String has unmatched template variables.';
        if (extraneousArgs) {
            Log.warn('Extraneous arguments have been passed to format string and therefore ' +
                'have not been include in the template string.');
        }
        return templateString;
    },
    modifyTemplatedQueryParams(template, params){
        //this approach assumes all template params are in the query string
        //this will break under any other circumstance
        var templates = template.replace('?', '').split('{')[1].split('}')[0].split(',');
        var url = template.split('{')[0] + '?';
        _.each(templates, key => {
            if (params[key] != null){
                url += key + '=' + params[key] + '&';
            }
        });
        return url;
    },
    scrubPIIFromStore(store) {
        /* eslint-disable camelcase */
        var state = {};
        if (store && store.currentUser) {
            state.currentUser = store.currentUser.asMutable();
            state.currentUser.meta = {};
            state.currentUser.first_name = 'Dana Katherine';
            state.currentUser.last_name = 'Scully';
            state.currentUser.email = 'dana@fbi.gov';
            state.currentUser.gender = 'female';
            state.currentUser.birthdate = '1964-02-23 00:00:00';
        }
        if (store && store.page && store.page.data && store.page.data.user_id) {
            state.page = {};
            state.page.data = store.page.data.asMutable();
            state.page.data.meta = {};
            state.page.data.first_name = 'Fox William';
            state.page.data.last_name = 'Mulder';
            state.page.data.email = 'fox@fbi.gov';
            state.page.data.gender = 'male';
            state.page.data.birthdate = '1961-08-13 00:00:00';
        }
        /* eslint-enable camelcase */
        state = _.defaults(state, store);
        return state;
    }
};

export default Util;

