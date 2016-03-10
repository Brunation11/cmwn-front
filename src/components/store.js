import _ from 'lodash';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import Immutable from 'seamless-immutable';

import DevTools from 'components/devtools';
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
            return page_.set('loading', true);
        }.bind(null, page),
        [ACTION_CONSTANTS.PAGE_LOADED]: function (page_) {
            return page_.set('loading', false);
        }.bind(null, page),
        [ACTION_CONSTANTS.END_PAGE_DATA]: function (page_, data) {
            page_ = page_.set('loading', false);
            return page_.set('data', data);
        }.bind(null, page, action.data)
    };

    if (action.type in reducers) {
        return reducers[action.type]();
    }
    return page;
};

var storedUserProperties = {};
if (window.localStorage['com.cmwn.platform.userName'] != null) {
    storedUserProperties.username = JSON.parse(window.localStorage['com.cmwn.platform.userName']);
}
if (window.localStorage['com.cmwn.platform.userId'] != null) {
    storedUserProperties.user_id = JSON.parse(window.localStorage['com.cmwn.platform.userId']); //eslint-disable-line camelcase
}
if (window.localStorage['com.cmwn.platform.profileImage'] != null) {
    storedUserProperties.image = JSON.parse(window.localStorage['com.cmwn.platform.profileImage']);
}
if (window.localStorage['com.cmwn.platform.roles'] != null) {
    storedUserProperties.roles = JSON.parse(window.localStorage['com.cmwn.platform.roles']);
}
if (window.localStorage['com.cmwn.platform._links'] != null) {
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
        [ACTION_CONSTANTS.REGISTER_COMPONENT]: function (component, defaultData) {
            var resetData = {
                data: _.defaults({}, defaultData),
                page_count: 1, //eslint-disable-line camelcase
                page: 1,
                total_items: 0, //eslint-disable-line camelcase
                page_size: GLOBALS.DEFAULT_PAGINATION_ROWS //eslint-disable-line camelcase
            };
            if (component == null) {
                return Immutable(resetData);
            } else {
                return component.merge(resetData);
            }
        }.bind(null, allComponents[action.endpointIdentifier + '-' + action.componentName], action.defaultData == null ? {} : action.defaultData),
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
        if (action.type === ACTION_CONSTANTS.FINISH_BOOTSTRAP || action.type === ACTION_CONSTANTS.END_AUTHORIZE_APP) {
            return true;
        }
        return isComplete;
    }
}), Immutable({routing: INITIAL_STATE}), compose(
    applyMiddleware(thunk),
    DevTools.instrument()
));
export default Store;
