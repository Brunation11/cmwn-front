/**
 * Actions.js
 * A list of all of the possible actions that can be taken
 * by the redux dispatch. Properties should be added as
 * the actions are dispatched, this list exists primarily
 * to avoid stupid typos, and to give an idea of what listeners
 * are available to inquisitive devs
 */

import _ from 'lodash';
import Immutable from 'seamless-immutable';

import ACTION_CONSTANTS from 'components/action_constants';
import Store from 'components/store';
import Log from 'components/log';
import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';

/**
 * Generates a dictionary of bound action creator functions.
 * See http://redux.js.org/docs/basics/Actions.html
 * The generated functions take 2 parameters:
 * Data - An object that will be merged with the type to create the action object. Must not include a 'type' property.
 * Transform - If for whatever reason merging into an object is not the desired behavior, a transform
 * function can be provided. This will be invoked by the bound action, and itself has two parameter, the type
 * name, and the passed in data, and should return an action with a type property
 */
var generateBasicBoundActions = function (actionNameList) {
    var defaultTransform = function (name, data = {}) {
        if (data.type != null) {
            Log.warn('Action data with a type property was passed. This type will be ignored.');
        }
        return Immutable(_.defaults({type: name}, data));
    };
    var actions = _.reduce(actionNameList, (a, name) => {
        a[name] = (data, transform = defaultTransform) => {
            return (transform(name, data));
        };
        return a;
    }, {});
    return Immutable(actions);
};

//********** Basic Actions
var Actions = generateBasicBoundActions(ACTION_CONSTANTS);
//********** Thunk Actions
//Thunk actions should be named START_YOUR_ACTION, and should resolve by dispatching an END_YOUR_ACTION
Actions = Actions.set(ACTION_CONSTANTS.PAGE_DATA, function (url, title) {
    if (url === '' || url == null) {
        return {
            type: ACTION_CONSTANTS.PAGE_DATA,
            payload: {
                promise: Promise.resolve({type: ACTION_CONSTANTS.PAGE_LOADED, title})
            }
        };
    }
    return {
        types: [
            'PAGE_DATA_PENDING',
            'PAGE_DATA_SUCCESS',
            'PAGE_DATA_ERROR'
        ],
        type: ACTION_CONSTANTS.PAGE_DATA,
        payload: {
            promise: HttpManager.GET({
                url: url,
                handlePageLevelErrors: true
            }).then(server => {
                return Promise.resolve((action, dispatch) => {
                    dispatch({
                        type: 'combo',
                        types: ['DELOADER_START', 'DELOADER_SUCCESS', 'DELOADER_ERROR'],
                        sequence: true,
                        payload: [
                            Actions.END_PAGE_DATA.bind(null, {data: server.response}),
                            Actions.LOADER_COMPLETE
                        ]
                    });
                    dispatch({type: 'LOADER_COMPLETE'});
                });
            })

        }
    };
            //NOTE: This is the primary page-level error handling block in the entire application
            //The only page-level error not handled here will be true 404 errors, which will be handled
            //in app.js by the router.
});

Actions = Actions.set(ACTION_CONSTANTS.AUTHORIZE_APP, function () {
    //if (window.localStorage.getItem('cmwn_token') != null) {
    //    return;
    //}
    return {
        types: [
            'AUTHORIZE_APP_PENDING',
            'AUTHORIZE_APP_SUCCESS',
            'AUTHORIZE_APP_ERROR'
        ],
        type: ACTION_CONSTANTS.AUTHORIZE_APP,
        payload: {
            promise: HttpManager.GET({
                url: GLOBALS.API_URL,
                handlePageLevelErrors: true
            }).then(server => {
                return Promise.resolve((action, dispatch) => {
                    HttpManager.setToken(server.response.token);
                    dispatch({
                        type: 'combo',
                        types: ['DELOADER_START', 'DELOADER_SUCCESS', 'DELOADER_ERROR'],
                        sequence: true,
                        payload: [
                            Actions.END_AUTHORIZE_APP.bind(null, {data: server.response}),
                            Actions.LOADER_COMPLETE
                        ]
                    });
                    dispatch({type: 'LOADER_COMPLETE'});
                });
            })
        }
    };
            /** @TODO MPR, 3/5/16: Handle Auth Errors*/
});

Actions = Actions.set(ACTION_CONSTANTS.COMPONENT_DATA, function (endpointIdentifier, componentName) {
    var endpoint;
    var state = Store.getState();
    if (state.page.data._links[endpointIdentifier + '-' + componentName]) {
        endpoint = state.page.data._links[endpointIdentifier + '-' + componentName].href;
    } else if (endpointIdentifier === 'games') {
        Log.info('forcing game endpoint');
        endpoint = GLOBALS.API_URL + 'game';
    } else {
        console.error('Component endpoint could not be resolved');
        throw 'Component endpoint could not be resolved';
    }
    return {
        types: [
            'SUBSCRIBER_GET_PENDING',
            'SUBSCRIBER_GET_SUCCESS',
            'SUBSCRIBER_GET_ERROR'
        ],
        type: ACTION_CONSTANTS.COMPONENT_DATA,
        payload: {
            promise: HttpManager.GET({url: endpoint}).then(server => {
                return Promise.resolve((action, dispatch, getState) => {
                    dispatch({
                        type: 'combo',
                        types: ['DELOADER_START', 'DELOADER_SUCCESS', 'DELOADER_ERROR'],
                        sequence: true,
                        payload: [
                            Actions.END_COMPONENT_DATA.bind(null, {data: server.response, endpointIdentifier, componentName}),
                            Actions.LOADER_COMPLETE
                        ]
                    });
                    dispatch({type: 'LOADER_COMPLETE'});
                })
            })
        }
    };
});

Actions = Actions.set('dispatch', _.reduce(Actions, (a, i, k) => {
    a[k] = function () {
        Store.dispatch(i(...arguments));
    };
    return a;
}, {}));

export default Actions;
