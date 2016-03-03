import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import Immutable from 'seamless-immutable';

//LOCATION_CHANGE is not currently returning correctly, so were hardcoding it
//import { LOCATION_CHANGE, routerReducer } from 'react-router-redux';
const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

import DevTools from 'components/devtools';

const INITIAL_STATE = Immutable({
    locationBeforeTransitions: null
});

var pageReducer = (page = {title: 'Change My World Now'}, action) => {
    var reducers = {
        CHANGE_TITLE: function () {
            return page.set('title', action);
        }.bind(page, action.title)
    };

    if (action.type in reducers) {
        return reducers[action.type]();
    }
    return page;
};


const Store = createStore( combineReducers({
    page: pageReducer,
    routing: routerReducer
}), Immutable({routing: INITIAL_STATE}), compose(
    applyMiddleware(thunk),
    DevTools.instrument()
));

export default Store;
