import _ from 'lodash';

import Actions from 'components/actions';
import Store from 'components/store';
import Log from 'components/log';
import GLOBALS from 'components/globals';
import EventManager from 'components/event_manager';
import HttpManager from 'components/http_manager';

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
    matchPathAndExtractParams(route = '', path = '') {
        var routeArray;
        var pathArray;
        var params = {};
        var routePart;
        var pathPart;
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
    },
    formatString() {
        var args = Array.prototype.slice.call(arguments);
        var templateString = args.shift();
        _.each(args, (arg, k) => {
            templateString = templateString.replace('{' + k + '}', arg);
        });
        return templateString;
    },
    reloadUser(newUser) {
        var getUser;
        if (newUser != null) {
            return this.storeUser(newUser);
        } else {
            getUser = HttpManager.GET({url: Store.getState().currentUser._links.me.href});
            return getUser.then(res => {
                /* @TODO MPR, 3/7/16: This should move to errors.js */
                if (res && res.status === 401 && res.response &&
                    res.response.error && res.response.error.detail === 'RESET_PASSWORD') {
                    if (~window.location.href.indexOf('change-password')) {
                        return Promise.resolve();
                    }
                    window.location.href = '/change-password';
                    return Promise.resolve();
                }
                return this.storeUser(res.response);
            }).catch(e => {
                Log.log(e, 'Error encountered during authorization check. Logging out.');
                //user is not logged in.
                this.logout();
                if (window.location.pathname !== '/login' && window.location.pathname !== '/login/') {
                    History.push('/login');
                    this._resolve();
                }
            });
        }
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
        var state = {};
        if(store && store.currentUser) {
            state.currentUser = store.currentUser.asMutable();
            state.currentUser.meta = {};
            state.currentUser.first_name = 'Dana Katherine';
            state.currentUser.last_name = 'Scully';
            state.currentUser.email = 'dana@fbi.gov';
            state.currentUser.gender = 'female';
            state.currentUser.birthdate = '1964-02-23 00:00:00';
        }
        if(store && store.page && store.page.data && store.page.data.user_id) {
            state.page = {};
            state.page.data = store.page.data.asMutable();
            state.page.data.meta = {};
            state.page.data.first_name = 'Fox William';
            state.page.data.last_name = 'Mulder';
            state.page.data.email = 'fox@fbi.gov';
            state.page.data.gender = 'male';
            state.page.data.birthdate = '1961-08-13 00:00:00';
        }
        state = _.defaults(state, store);
        return state;
    }
};

export default Util;

