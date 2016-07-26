import _ from 'lodash';

import Actions from 'components/actions';
import Store from 'components/store';
import Log from 'components/log';
import GLOBALS from 'components/globals';
import EventManager from 'components/event_manager';

var Util = {
    setPageTitle: function (text) {
        var titleElem = document.getElementsByTagName('title')[0];
        var title = document.createTextNode(text);
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
        window.localStorage.setItem('com.cmwn.platform.userName', null);
        window.localStorage.setItem('com.cmwn.platform.userId', null);
        window.localStorage.setItem('com.cmwn.platform.profileImage', null);
        window.localStorage.setItem('com.cmwn.platform.roles', null);
        window.localStorage.setItem('com.cmwn.platform._links', null);
        Actions.dispatch.LOGOUT();
        Log.info('User logout successful');
        EventManager.update('userChanged', null);
    },
    formatString() {
        var args = Array.prototype.slice.call(arguments);
        var templateString = args.shift();
        _.each(args, (arg, k) => {
            templateString = templateString.replace('{' + k + '}', arg);
        });
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
    }
};

export default Util;

