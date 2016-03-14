import _ from 'lodash';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import combineActionsMiddleware from 'redux-combine-actions';
import promiseMiddleware from 'redux-promise-middleware';
import Immutable from 'seamless-immutable';

import DevTools from 'components/devtools';
import Log from 'components/log';
import ACTION_CONSTANTS from 'components/action_constants';
import GLOBALS from 'components/globals';

const INITIAL_STATE = Immutable({
    locationBeforeTransitions: null
});

var pageReducer = (page = Immutable({title: 'Change My World Now'}), action) => {
    var reducers = {
        [ACTION_CONSTANTS.PAGE_TITLE]: function (page_, title) {
            return page_.set('title', title);
        }.bind(null, page, action.title),
        [ACTION_CONSTANTS.PAGE_LOADING]: function (page_) {
            page_ = page_.set('initialized', false);
            return page_.set('loading', true);
        }.bind(null, page),
        [ACTION_CONSTANTS.PAGE_LOADED]: function (page_) {
            return page_.set('loading', false);
        }.bind(null, page),
        [ACTION_CONSTANTS.PAGE_INTITIALIZED]: function (page_) {
            return page_.set('loading', false);
        }.bind(null, page),
        [ACTION_CONSTANTS.END_PAGE_DATA]: function (page_, action_) {
            page_ = page_.set('loading', false);
            page_ = page_.set('initialized', true);
            page_ = page_.set('title', action_.title);
            return page_.set('data', action_.data);
        }.bind(null, page, action)
    };

    if (action.type in reducers) {
        return reducers[action.type]();
    }
    return page;
};

var storedUserProperties = {};
var userName = window.localStorage['com.cmwn.platform.userName'];
var userId = window.localStorage['com.cmwn.platform.userId'];
var profileImage = window.localStorage['com.cmwn.platform.profileImage'];
var roles = window.localStorage['com.cmwn.platform.roles'];
var _links = window.localStorage['com.cmwn.platform._links'];
if (userName != null && userName !== 'null' && userName !== 'undefined') {
    storedUserProperties.username = JSON.parse(window.localStorage['com.cmwn.platform.userName']);
}
if (userId != null && userId !== 'null' && userId !== 'undefined') {
    storedUserProperties.user_id = JSON.parse(window.localStorage['com.cmwn.platform.userId']); //eslint-disable-line camelcase
}
if (profileImage != null && profileImage !== 'null' && profileImage !== 'undefined') {
    storedUserProperties.image = JSON.parse(window.localStorage['com.cmwn.platform.profileImage']);
}
if (roles != null && roles !== 'null' && roles !== 'undefined') {
    storedUserProperties.roles = JSON.parse(window.localStorage['com.cmwn.platform.roles']);
}
if (_links != null && _links !== 'null' && _links !== 'undefined') {
    storedUserProperties._links = JSON.parse(window.localStorage['com.cmwn.platform._links']);
}
var authReducer = (currentUser = Immutable(storedUserProperties), action) => {
    var reducers = {
        [ACTION_CONSTANTS.LOGOUT]: function () {
            return Immutable({});
        },
        [ACTION_CONSTANTS.END_AUTHORIZE_APP]: function (currentUser_, data) {
            currentUser_ = currentUser_.set('token', data.token);
            if (data.user_id != null) {
                currentUser_ = currentUser_.merge(data);
            }
            return currentUser_;
        }.bind(null, currentUser, action.data)
    };
    if (action.type in reducers) {
        return reducers[action.type]();
    }
    return currentUser;
};
var locationReducer = (previousLoc = {}, action) => {
    var reducers = {PATH_CHANGE: 0, HASH_CHANGE: 0, SEARCH_CHANGE: 0};
    if (!(action.type in reducers) || action.location == null) {
        return previousLoc;
    }
    reducers[ACTION_CONSTANTS.PATH_CHANGE] = function (locStore, location) {
        return location;
    }.bind(null, previousLoc, action.location);
    reducers[ACTION_CONSTANTS.HASH_CHANGE] = function (locStore, hash) {
        return locStore.merge({hash});
    }.bind(null, previousLoc, action.location.hash);
    reducers[ACTION_CONSTANTS.SEARCH_CHANGE] = function (locStore, search) {
        return locStore.merge({search});
    }.bind(null, previousLoc, action.location.search);

    return reducers[action.type]();
};

var componentReducer = (allComponents = Immutable({}), action) => {
    var reducers = {
        [ACTION_CONSTANTS.COMPONENT_LOADED]: function (component) {
            return component.set('loading', false);
        }.bind(null, allComponents[action.endpointIdentifier + '-' + action.componentName]),
        [ACTION_CONSTANTS.COMPONENT_LOADING]: function (component) {
            return component.set('loading', true);
        }.bind(null, allComponents[action.endpointIdentifier + '-' + action.componentName]),
        [ACTION_CONSTANTS.END_COMPONENT_DATA]: function (component) {
            var extractedEmbedded = _.reduce(action.data._embedded, (a, i) => i);
            component = component.set('loading', false);
            component = component.set('response', action.data);
            component = component.set('data', extractedEmbedded);
            component = component.set('_links', action.data._links);
            component = component.set('page_count', action.data.page_count);
            component = component.set('page_size', action.data.page_size);
            component = component.set('total_items', action.data.total_items);
            component = component.set('page', action.data.page);
            return component;
        }.bind(null, allComponents[action.endpointIdentifier + '-' + action.componentName]),
    };
    if (action.type in reducers) {
        return allComponents.set(action.endpointIdentifier + '-' + action.componentName, reducers[action.type]());
    } else if (action.type === ACTION_CONSTANTS.REGISTER_COMPONENT) {
        var actionData = action.defaultData == null ? {} : action.defaultData;
        var resetData = {
            data: _.defaults({}, actionData),
            page_count: 1, //eslint-disable-line camelcase
            page: 1,
            total_items: 0, //eslint-disable-line camelcase
            page_size: GLOBALS.DEFAULT_PAGINATION_ROWS //eslint-disable-line camelcase
        };
        return allComponents.merge({[action.endpointIdentifier + '-' + action.componentName]: resetData});
    }
    return allComponents;
};
const Store = createStore( combineReducers({
    page: pageReducer,
    currentUser: authReducer,
    location: locationReducer,
    routing: routerReducer,
    components: componentReducer,
    bootstrapComplete: (isComplete = false, action) => {
        if (action.type === ACTION_CONSTANTS.FINISH_BOOTSTRAP) {
            return true;
        }
        return isComplete;
    },
    pageLoadingStage: (loaderState = {currentStage: 0, lastCompletedStage: 0}, action) => {
        if (action.type === ACTION_CONSTANTS.RESET_LOADER) {
            return {currentStage: 0, lastCompletedStage: 0};
        }
        if (action.type === ACTION_CONSTANTS.LOADER_START) {
            return {currentStage: loaderState.currentStage + 1, lastCompletedStage: loaderState.lastCompletedStage};
        }
        if (action.type === ACTION_CONSTANTS.LOADER_COMPLETE) {
            return {currentStage: loaderState.currentStage, lastCompletedStage: loaderState.lastCompletedStage + 1};
        }
        if (action.type === ACTION_CONSTANTS.LOADER_ERROR) {
            Log.error('Loader error at stage ' + loaderState.currentStage);
        }
        return loaderState;
    }
}), Immutable({routing: INITIAL_STATE}), compose(
    applyMiddleware(combineActionsMiddleware, thunk, promiseMiddleware()),
    DevTools.instrument()
));
export default Store;
