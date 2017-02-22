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
import Moment from 'moment';

import ACTION_CONSTANTS from 'components/action_constants';
import Store from 'components/store';
import Log from 'components/log';
import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import Errors from 'components/errors';
import Util from 'components/util';

const LS_LAST_LOGIN = 'LAST_LOGIN_DATE';

/**
 * Generates a dictionary of bound action creator functions.
 * See http://redux.js.org/docs/basics/Actions.html
 * The generated functions take 2 parameters:
 * Data - An object that will be merged with the type to create the action object.
 * Must not include a 'type' property.
 * Transform - If for whatever reason merging into an object is not the desired behavior, a transform
 * function can be provided. This will be invoked by the bound action, and itself has two parameter, the type
 * name, and the passed in data, and should return an action with a type property
 * @param {map} actionNameList a list
 * @returns {array} Immutable(_.defaults({type: name}, data)),
 * (transform(name, data)), a, or Immutable(actions)
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

//********** Basic Action Creators
var Actions = generateBasicBoundActions(ACTION_CONSTANTS);

//********** Thunk Action Creators
//Thunk actions should be named START_YOUR_ACTION, and should resolve by dispatching an END_YOUR_ACTION
Actions = Actions.set(ACTION_CONSTANTS.AUTHORIZE_APP, function () {
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
                    var now = Moment();
                    var lastLogin;

                    HttpManager.setToken(server.response.token);
                    //configure trackers to logged in user
                    Rollbar.configure({payload: {person: {id: server.response.user_id, //eslint-disable-line no-undef, max-len
                        username: server.response.username}}});
                    ga('set', 'userId', server.response.user_id);
                    ga('set', 'dimension1', server.response.type);
                    ga('set', 'dimension2',
                        (new Date(Date.now()).getFullYear()) - (Moment(server.response.birthdate).year()));
                    ga('set', 'dimension3', server.response.gender);
                    if (_.has(server.response, '_embedded.groups')) {
                        _.each(server.response._embedded.groups, i => {
                            ga('set', 'dimension8', i.title + ':' + i.group_id);
                        });
                    }

                    try {
                        lastLogin = Moment(window.localStorage[LS_LAST_LOGIN + server.response.user_id] || 0);
                    } catch(error) {
                        lastLogin = Moment(window._localStorage[
                            LS_LAST_LOGIN + server.response.user_id
                        ] || 0);
                    }

                    try {
                        window.localStorage.setItem(LS_LAST_LOGIN + server.response.user_id,
                            now.toDate().toISOString());
                    } catch(error) {
                        window._localStorage.setItem(LS_LAST_LOGIN + server.response.user_id,
                            now.toDate().toISOString());
                    }
                    if (now.format('X') - lastLogin.format('X') > 86164 || //seconds in a day
                            now.date() !== lastLogin.date()) {
                        ga('set', 'dimension9', 1);
                    }

                    if (server.response.user_id == null) {
                        Errors.handle401();
                        dispatch(Actions[ACTION_CONSTANTS.NO_USER_AUTHORIZED]({data: server.response}));
                        dispatch(Actions[ACTION_CONSTANTS.ADVANCE_LOAD_STAGE]());
                    } else {
                        dispatch({
                            type: 'combo',
                            types: ['DELOADER_START', 'DELOADER_SUCCESS', 'DELOADER_ERROR'],
                            sequence: true,
                            payload: [
                                Actions.END_AUTHORIZE_APP.bind(null, {data: server.response}),
                                Actions.ADVANCE_LOAD_STAGE
                            ]
                        });
                    }
                }).catch(err => {
                    Errors.handle401(err);
                });
            }).catch(err => {
                Errors.handle401(err);
            })
        }
    };
});

Actions = Actions.set(ACTION_CONSTANTS.PAGE_DATA, function (url, title) {
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
                        /** @TODO MPR, 3/24/16: Change these dumb names **/
                        sequence: true,
                        payload: [
                            Actions.END_PAGE_DATA.bind(null, {data: server.response, title}),
                            Actions.ADVANCE_LOAD_STAGE
                        ]
                    });
                });
            }).catch(err => {
                //NOTE: This is the primary page-level error handling block in the entire application
                //The only page-level error not handled here will be true 404 errors, which will be handled
                //in app.js by the router.
                Errors.handlePageErrors(err);
                Log.error('Server Error: ' + _.isString(err) ? err : err.status);
            })
        }
    };
});

Actions = Actions.set(ACTION_CONSTANTS.START_RELOAD_PAGE, function (state) {
    return {
        type: ACTION_CONSTANTS.END_RELOAD_PAGE,
        payload: {
            promise: HttpManager.GET({url: state.page.data._links.self.href})
        }
    };
});

Actions = Actions.set(ACTION_CONSTANTS.GET_NEXT_PAGE_PAGE, function (state, pageNum) {
    return {
        type: ACTION_CONSTANTS.END_GET_NEXT_PAGE_PAGE,
        payload: {
            promise: HttpManager.GET({url: Util.modifyTemplatedQueryParams(
                state.page.data._links.find.href,
                {page: pageNum, per_page: //eslint-disable-line camelcase
                    state.page.data.page_size}
            )})
        }
    };
});

Actions = Actions.set(ACTION_CONSTANTS.CHANGE_PAGE_ROW_COUNT, function (state, itemCount) {
    return {
        type: ACTION_CONSTANTS.END_CHANGE_PAGE_ROW_COUNT,
        payload: {
            promise: HttpManager.GET({url: Util.modifyTemplatedQueryParams(
                state.page.data._links.find.href,
                {per_page: itemCount, page: 1} //eslint-disable-line camelcase
            ) })
        }
    };
});

Actions = Actions.set(ACTION_CONSTANTS.COMPONENT_DATA, function (endpointIdentifier, componentName) {
    var endpoint;
    var state = Store.getState();
    if (Util.linkIsPresentInUserOrPage(state, endpointIdentifier)) {
        endpoint = Util.getLinkFromPageFallbackToCurrentUser(state, endpointIdentifier);
    } else {
        Log.info('HAL Link for component endpoint ' + endpointIdentifier +
            ' could not be resolved in component ' + componentName +
            '. Component will not be displayed. This is not necessarily an error, and the server' +
            'inteded to hide this component for this user.');
        return {type: 'noop', action: {endpointIdentifier, componentName, reason: 'Endpoint not found'}};
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
                return Promise.resolve((action, dispatch) => {
                    dispatch({
                        type: 'combo',
                        types: ['DELOADER_START', 'DELOADER_SUCCESS', 'DELOADER_ERROR'],
                        sequence: true,
                        payload: [
                            Actions.END_COMPONENT_DATA.bind(null,
                                {data: server.response, endpointIdentifier, componentName}),
                            Actions.COMPONENT_LOADER_COMPLETE
                        ]
                    });
                    if (state.components._componentsToLoad - 1 === state.components._componentsLoaded) {
                        Actions.dispatch.LOADER_START();//unlike other stages, we advance this one at the
                        //very end, rather than the beginning
                        Actions.dispatch.ADVANCE_LOAD_STAGE();
                    }
                });
            })
        }
    };
});

Actions = Actions.set(ACTION_CONSTANTS.GET_NEXT_COMPONENT_PAGE, function
    (state, endpointIdentifier, componentName, pageNum) {
    var endpoint = Util.modifyTemplatedQueryParams(
        state.components[endpointIdentifier + '-' + componentName]._links.find.href, {
            page: pageNum,
            'per_page': state.components[endpointIdentifier + '-' + componentName].page_size
        }
    );
    return {
        type: 'ACTION_CONSTANTS.GET_NEXT_COMPONENT_PAGE',
        payload: {
            promise: HttpManager.GET({url: endpoint}).then(server => {
                return Promise.resolve((action, dispatch) => {
                    dispatch(Actions.END_GET_NEXT_COMPONENT_PAGE(
                        {data: server.response, endpointIdentifier, componentName}));
                });
            })
        }
    };
});

Actions = Actions.set(ACTION_CONSTANTS.CHANGE_COMPONENT_ROW_COUNT, function
    (state, endpointIdentifier, componentName, rowCount) {
    var endpoint = Util.modifyTemplatedQueryParams(
        state.components[endpointIdentifier + '-' + componentName]._links.find.href, {
            page: state.components[endpointIdentifier + '-' + componentName].page,
            'per_page': rowCount
        }
    );
    return {
        type: 'ACTION_CONSTANTS.CHANGE_COMPONENT_ROW_COUNT',
        payload: {
            promise: HttpManager.GET({url: endpoint}).then(server => {
                return Promise.resolve((action, dispatch) => {
                    dispatch(Actions.END_CHANGE_COMPONENT_ROW_COUNT(
                        {data: server.response, endpointIdentifier, componentName}));
                });
            })
        }
    };
});

Actions = Actions.set(ACTION_CONSTANTS.GET_NEXT_INFINITE_COMPONENT_PAGE, function
    (state, endpointIdentifier, componentName) {
    console.log('here');
    debugger;
    var componentKey = endpointIdentifier + '-' + componentName;
    var endpoint;
    if (
        state.components == null ||
        state.components[componentKey] == null ||
        state.components[componentKey]._links == null
    ) {
        return {
            type: 'ACTION_CONSTANTS.GET_NEXT_INFINITE_COMPONENT_PAGE',
            payload: []
        };
    }
    endpoint = Util.modifyTemplatedQueryParams(
        state.components[componentKey]._links.find.href, {
            page: state.components[componentKey].page_count === 1 ?
                1 :
                state.components[componentKey].page + 1,
            'per_page': state.components[componentKey].page_size
        }
    );
    return {
        type: 'ACTION_CONSTANTS.GET_NEXT_INFINITE_COMPONENT_PAGE',
        payload: {
            promise: HttpManager.GET({url: endpoint}).then(server => {
                return Promise.resolve((action, dispatch) => {
                    dispatch(Actions.END_GET_NEXT_INFINITE_COMPONENT_PAGE(
                        {data: server.response, endpointIdentifier, componentName}));
                });
            })
        }
    };
});

Actions = Actions.set(ACTION_CONSTANTS.GET_NEXT_COMPONENT_PAGE, function
    (state, endpointIdentifier, componentName, pageNum) {
    var endpoint = Util.modifyTemplatedQueryParams(
        state.components[endpointIdentifier + '-' + componentName]._links.find.href, {
            page: pageNum,
            'per_page': state.components[endpointIdentifier + '-' + componentName].page_size
        }
    );
    return {
        type: 'ACTION_CONSTANTS.GET_NEXT_COMPONENT_PAGE',
        payload: {
            promise: HttpManager.GET({url: endpoint}).then(server => {
                return Promise.resolve((action, dispatch) => {
                    dispatch(Actions.END_GET_NEXT_COMPONENT_PAGE(
                        {data: server.response, endpointIdentifier, componentName}));
                });
            })
        }
    };
});

Actions = Actions.set(ACTION_CONSTANTS.CHANGE_COMPONENT_ROW_COUNT, function
    (state, endpointIdentifier, componentName, rowCount) {
    var endpoint = Util.modifyTemplatedQueryParams(
        state.components[endpointIdentifier + '-' + componentName]._links.find.href, {
            page: state.components[endpointIdentifier + '-' + componentName].page,
            'per_page': rowCount
        }
    );
    return {
        type: 'ACTION_CONSTANTS.CHANGE_COMPONENT_ROW_COUNT',
        payload: {
            promise: HttpManager.GET({url: endpoint}).then(server => {
                return Promise.resolve((action, dispatch) => {
                    dispatch(Actions.END_CHANGE_COMPONENT_ROW_COUNT(
                        {data: server.response, endpointIdentifier, componentName}));
                });
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

