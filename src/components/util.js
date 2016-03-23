import _ from 'lodash';

import Actions from 'components/actions';
import Store from 'components/store';
import Log from 'components/log';
import GLOBALS from 'components/globals';
import EventManager from 'components/event_manager';

var Util = {
    /**
     *  Takes in a nested json object and extracts properties from its data
     *  Expects nested data to have the following properties:
     *  'data' properties will exist at any level at whih an entity can exists
     *  e.g. classes.data.users.data
     *  'data' will arbitrarily be an array or object
     *  @param {object} target - the target json data
     *  @param {string} key - the property to extract
     *  @param {*} [notFoundValue=null] - value to be returned if key does not exist
     *  @returns {*} - generally returns an array of one or more entities, or if the
     *  property does not exist, returns notFoundValue
     */
    normalize: function (target, key, notFoundValue) {
        var retVal = _.get(target, 'data', target);
        retVal = _.get(retVal, key, retVal);
        retVal = _.get(retVal, 'data', retVal);
        retVal = retVal === target.data || retVal === target ? notFoundValue : retVal;
        retVal = _.isArray(retVal) ? retVal : [retVal];
        return retVal;
    },
    addAttr: function (item, key, value) {
        item[key] = value;
        return value;
    },
    /** from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript */
    uuid: function () {
        Log.info('uuid deprecated. Use ShortId');
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);//eslint-disable-line eqeqeq
            return v.toString(16);
        });
    },
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
        var routePart, pathPart;
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
        var routeArray = route.split('/');
        var routePart;
        var path = '';
        while (routeArray.length) {
            routePart = routeArray.shift();
            if (routePart === '') {
                continue;
            } else if (!~routePart.indexOf(':')) {
                path += routePart + '/';
            } else if (routePart.slice(1) in params) {
                path += params[routePart.slice(1)] + '/';
            } else {
                throw 'Path could not be constructed; Expected parameter was not passed.';
            }
        }
        return path.slice(0, -1);
    },
    attemptComponentLoad(state, endpointIdentifier, componentName) {
        if (state.pageLoadingStage.lastCompletedStage !== GLOBALS.PAGE_LOAD_STATE.COMPONENT || state.components[endpointIdentifier + '-' + componentName].requested) {
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
            create: true, update: true, delete: true
        };
        var pad = '0000';
        var bits;
        if (val !== -1) {
            bits = (val >>> 0).toString(2);
            bits = pad.substring(0, pad.length - bits.length) + bits;
            perms = {
                create: !!+bits.slice(-3),
                update: !!+bits.slice(-2),
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
    }
};

export default Util;

