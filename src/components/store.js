/* eslint-disable vars-on-top */
import _ from 'lodash';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import combineActionsMiddleware from 'redux-combine-actions';
import promiseMiddleware from 'redux-promise-middleware';
import Immutable from 'seamless-immutable';

import DevTools from 'components/devtools';
import DevReducers from 'components/dev_reducers';
import Log from 'components/log';
import ACTION_CONSTANTS from 'components/action_constants';
import GLOBALS from 'components/globals';

const INITIAL_STATE = Immutable({
    locationBeforeTransitions: null
});

var isAvailable = window.__cmwn.MODE === 'dev' || window.__cmwn.MODE === 'development' || window.__cmwn.MODE === 'local';

var populate = function (host, key, storageKey) {
    var prop = window.localStorage[storageKey];
    if (window.localStorage == null) {
        return null;
    }
    if (prop != null && prop !== 'null' && prop !== 'undefined') {
        try {
            host[key] = JSON.parse(prop);
        } catch(err) {
            host[key] = prop;
        }
    }
};

var devReducer = _.isFunction(DevReducers) && isAvailable ? DevReducers : _.identity();

var storedUserProperties = {};

populate(storedUserProperties, 'username', 'com.cmwn.platform.userName');
populate(storedUserProperties, 'user_id', 'com.cmwn.platform.userId');
populate(storedUserProperties, 'image', 'com.cmwn.platform.profileImage');
populate(storedUserProperties, 'roles', 'com.cmwn.platform.roles');
populate(storedUserProperties, '_links', 'com.cmwn.platform._links');

var authReducer = (currentUser = Immutable(storedUserProperties), action) => {
    var reducers = {
        [ACTION_CONSTANTS.LOGOUT]: function (currentUser_) {
            var nextUser = Immutable({
                _links: currentUser_._links,
                token: currentUser_.token
            });
            return Immutable(nextUser);
        }.bind(null, currentUser),
        [ACTION_CONSTANTS.DESTROY_CURRENT_USER]: function (currentUser_) {
            var nextUser = Immutable({
                _links: currentUser_._links,
                token: currentUser_.token
            });
            return Immutable(nextUser);
        }.bind(null, currentUser),
        [ACTION_CONSTANTS.UPDATE_USERNAME]: function (currentUser_, username) {
            var nextUser = currentUser.set('username', username);
            return nextUser;
        }.bind(null, currentUser, action.username),
        [ACTION_CONSTANTS.NO_USER_AUTHORIZED]: function (currentUser_, data) {
            currentUser_ = currentUser_.set('token', data.token);
            currentUser_ = currentUser_.merge(data);
            return currentUser_;
        }.bind(null, currentUser, action.data),
        [ACTION_CONSTANTS.END_AUTHORIZE_APP]: function (currentUser_, data) {
            currentUser_ = currentUser_.set('token', data.token);
            if (data.user_id != null) {
                currentUser_ = currentUser_.merge(data);
            }
            //hardcoding users to their first organization for the time being
            //eventually this will need to be broken out into a fourth section
            //with its own url template binding rules, but for the time being
            //there is no difference between /users and /org/my-org/users
            //if (_.has(action, 'data._embedded.organizations[0]._links.org_users')) {
            //    currentUser_ = currentUser_.setIn(['_links', 'user'], _.defaults(
            //        {label: 'Friends and Network', view_url: '/users'}, // eslint-disable-line camelcase
            //        action.data._embedded.organizations[0]._links.org_users
            //    ));
            //}
            return currentUser_;
        }.bind(null, currentUser, action.data)
    };
    if (action.type in reducers) {
        return reducers[action.type]();
    }
    return currentUser;
};

var pageReducer = (page = Immutable({title: 'Change My World Now'}), action) => {
    var reducers = {
        [ACTION_CONSTANTS.PAGE_TITLE]: function (page_, title) {
            return page_.set('title', title);
        }.bind(null, page, action.title),
        [ACTION_CONSTANTS.PAGE_LOADING]: function (page_) {
            page_ = page_.set('initialized', false);
            page_ = page_.without('data');
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
            page_ = page_.set('data', action_.data);
            return page_;
        }.bind(null, page, action),
        [ACTION_CONSTANTS.END_GET_NEXT_PAGE_PAGE]: function (page_, action_) {
            page_ = page_.set('data', action_.data);
            return page_;
        }.bind(null, page, action),
        [ACTION_CONSTANTS.END_CHANGE_PAGE_ROW_COUNT]: function (page_, action_) {
            page_ = page_.set('data', action_.data);
            return page_;
        }.bind(null, page, action),
        [ACTION_CONSTANTS.PAGE_DATA_REJECTED]: function (page_) {
            //do something?
            return page_;
        }.bind(null, page, action),
        [ACTION_CONSTANTS.END_RELOAD_PAGE_FULFILLED]: function (page_, action_) {
            page_ = page_.set('data', action_.payload.response);
            return page_;
        }.bind(null, page, action)
    };

    if (action.type in reducers) {
        return reducers[action.type]();
    }
    return page;
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

var componentReducer = (allComponents = Immutable({_componentsToLoad: 0, _componentsLoaded: 0}), action) => {
    /* @TODO MPR, 5/25/16: Update from Laravel pagination names */
    var setComponentData = function (component) {
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
    };
    //single component reducers
    var reducers = {
        [ACTION_CONSTANTS.COMPONENT_REQUESTED]: function (component) {
            return component.set('requested', true);
        }.bind(null, allComponents[action.endpointIdentifier + '-' + action.componentName]),
        [ACTION_CONSTANTS.COMPONENT_LOADED]: function (component) {
            return component.set('loading', false);
        }.bind(null, allComponents[action.endpointIdentifier + '-' + action.componentName]),
        [ACTION_CONSTANTS.COMPONENT_LOADING]: function (component) {
            return component.set('loading', true);
        }.bind(null, allComponents[action.endpointIdentifier + '-' + action.componentName]),
        [ACTION_CONSTANTS.END_COMPONENT_DATA]: function (component) {
            return setComponentData(component);
        }.bind(null, allComponents[action.endpointIdentifier + '-' + action.componentName]),
        [ACTION_CONSTANTS.END_GET_NEXT_COMPONENT_PAGE]: function (component) {
            return setComponentData(component);
        }.bind(null, allComponents[action.endpointIdentifier + '-' + action.componentName]),
        [ACTION_CONSTANTS.END_CHANGE_COMPONENT_ROW_COUNT]: function (component) {
            return setComponentData(component);
        }.bind(null, allComponents[action.endpointIdentifier + '-' + action.componentName]),
    };

    //component-wide reducers
    if (action.type in reducers) {
        return allComponents.set(action.endpointIdentifier + '-' + action.componentName, reducers[action.type]());
    } else if (action.type === ACTION_CONSTANTS.COMPONENT_LOADER_COMPLETE) {
        allComponents = allComponents.set('_componentsLoaded', allComponents._componentsLoaded + 1);
    } else if (action.type === ACTION_CONSTANTS.REGISTER_COMPONENT) {
        var actionData = action.defaultData == null ? {} : action.defaultData;
        var resetData = {
            data: _.defaults({}, actionData),
            page_count: 1, //eslint-disable-line camelcase
            page: 1,
            requested: false,
            total_items: 0, //eslint-disable-line camelcase
            page_size: GLOBALS.DEFAULT_PAGINATION_ROWS //eslint-disable-line camelcase
        };
        allComponents = allComponents.set('_componentsToLoad', allComponents._componentsToLoad == null ? 1 : allComponents._componentsToLoad + 1);
        return allComponents.merge({[action.endpointIdentifier + '-' + action.componentName]: resetData});
    }
    return allComponents;
};
const composeMiddleware = [
    applyMiddleware(combineActionsMiddleware, thunk, promiseMiddleware())
];
if (isAvailable && DevTools && DevTools.instrument != null) {
    composeMiddleware.push(DevTools.instrument());
}

const Store = createStore( function (state = {}, action) {
    if (action.error) {
        Log.error(action.payload);
    }
    state = combineReducers({
        page: pageReducer,
        currentUser: authReducer,
        location: locationReducer,
        routing: routerReducer,
        components: componentReducer,
        bootstrapComplete: (isComplete = false, action_) => {
            if (action_.type === ACTION_CONSTANTS.FINISH_BOOTSTRAP) {
                return true;
            }
            return isComplete;
        },
        pageLoadingStage: (loaderState = {currentStage: 0, lastCompletedStage: 0}, action_) => {
            if (action_.type === ACTION_CONSTANTS.RESET_LOADER) {
                return {currentStage: 0, lastCompletedStage: 0};
            }
            if (action_.type === ACTION_CONSTANTS.LOADER_START) {
                return {currentStage: loaderState.currentStage + 1, lastCompletedStage: loaderState.lastCompletedStage};
            }
            if (action_.type === ACTION_CONSTANTS.ADVANCE_LOAD_STAGE) {
                return {currentStage: loaderState.currentStage, lastCompletedStage: loaderState.lastCompletedStage + 1};
            }
            if (action_.type === ACTION_CONSTANTS.LOADER_ERROR) {
                if (loaderState.currentStage === GLOBALS.PAGE_LOAD_STATE.COMPONENT) {
                    Log.error('HAL link required for component load not provided. Will not load because: ' + action.payload);
                } else if (action_.error) {
                    Log.error('Loader error at stage ' + loaderState.currentStage + ' : ' + action_.payload);
                } else {
                    Log.error('Loader error at stage ' + loaderState.currentStage);
                }
            }
            return loaderState;
        }
    })(state, action);
    if (_.isFunction(DevReducers) && isAvailable) {
        state = devReducer(state, action);
    }
    return state;
}, Immutable({routing: INITIAL_STATE}), compose(...composeMiddleware));
export default Store;

