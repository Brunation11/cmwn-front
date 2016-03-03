import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import Immutable from 'seamless-immutable';

import DevTools from 'components/devtools';

const INITIAL_STATE = Immutable({
    locationBeforeTransitions: null
});

var pageReducer = (page = Immutable({title: 'Change My World Now'}), action) => {
    var reducers = {
        CHANGE_TITLE: function (page, title) {
            return page.set('title', title);
        }.bind(null, page, action.title),
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
    reducers.PATH_CHANGE = function (locStore, location) {
        return location;
    }.bind(null, previousLoc, action.location);
    reducers.HASH_CHANGE = function (locStore, hash) {
        return locStore.merge({hash});
    }.bind(null, previousLoc, action.location.hash);
    reducers.SEARCH_CHANGE = function (locStore, search) {
        return locStore.merge({search});
    }.bind(null, previousLoc, action.location.search);

    return reducers[action.type]();
};


const Store = createStore( combineReducers({
    page: pageReducer,
    location: locationReducer,
    routing: routerReducer
}), Immutable({routing: INITIAL_STATE}), compose(
    applyMiddleware(thunk),
    DevTools.instrument()
));

export default Store;
