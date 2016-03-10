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
    var dispatch = Store.dispatch;
    var defaultTransform = function (name, data = {}) {
        if (data.type != null) {
            Log.warn('Action data with a type property was passed. This type will be ignored.');
        }
        return Immutable(_.defaults({type: name}, data));
    };
    var actions = _.reduce(actionNameList, (a, name) => {
        a[name] = (data, transform = defaultTransform) => {
            dispatch(transform(name, data));
        };
        return a;
    }, {});
    return Immutable(actions);
};

//********** Basic Actions
var Actions = generateBasicBoundActions(ACTION_CONSTANTS);
//********** Thunk Actions
//Thunk actions should be named START_YOUR_ACTION, and should resolve by dispatching an END_YOUR_ACTION
Actions = Actions.set(ACTION_CONSTANTS.START_PAGE_DATA, function (url, title) {
    Store.dispatch((dispatch) => {
        if (url === '' || url === '/') {
            //page has no unique data. Punt to authorize for userdata
            return Promise.resolve().then(() => {
                dispatch({type: ACTION_CONSTANTS.PAGE_LOADED, title});
            });
        }
        HttpManager.GET({
            url: url,
            handlePageLevelErrors: true
        }).then(server => {
            dispatch({type: ACTION_CONSTANTS.END_PAGE_DATA, data: server.response});
        }).catch(err => {
            //NOTE: This is the primary page-level error handling block in the entire application
            //The only page-level error not handled here will be true 404 errors, which will be handled
            //in app.js by the router.
        });
    });
});

Actions = Actions.set(ACTION_CONSTANTS.START_AUTHORIZE_APP, function () {
    var state = Store.getState();
    if (state.currentUser.user_id != null) {
        return;
    }
    Store.dispatch((dispatch) => {
        HttpManager.GET({
            url: GLOBALS.API_URL,
            handlePageLevelErrors: true
        }).then(server => {
            dispatch({type: ACTION_CONSTANTS.END_AUTHORIZE_APP, data: server.response});
        }).catch(err => {
            /** @TODO MPR, 3/5/16: Handle Auth Errors*/
        });
    });
});

Actions = Actions.set(ACTION_CONSTANTS.START_COMPONENT_DATA, function (endpointIdentifier, componentName, onError) {
    Store.dispatch(dispatch => {
        var endpoint;
        if(Store.getState().page.data._links[endpointIdentifier]) {
            endpoint = Store.getState().page.data._links[endpointIdentifier].href;
        } else {
            throw 'Component endpoint could not be resolved';
        }
        HttpManager.GET({url: endpoint}).then(server => {
            dispatch({type: ACTION_CONSTANTS.END_COMPONENT_DATA, data: server.response, endpointIdentifier, componentName});
        }).catch(onError);
    });
});

export default Actions;

