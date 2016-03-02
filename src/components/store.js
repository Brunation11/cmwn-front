import { createStore, compose } from 'redux';
import Immutable from 'immutable';
import { combineReducers } from 'redux-immutable';
//LOCATION_CHANGE is not currently returning correctly, so were hardcoding it
//import { LOCATION_CHANGE, routerReducer } from 'react-router-redux';
const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

import DevTools from 'components/devtools';

const INITIAL_STATE = Immutable.fromJS({
    locationBeforeTransitions: null
});

const Store = createStore( combineReducers({
    routing: (state = INITIAL_STATE, action) => {
        //custom immutable router reducer from https://github.com/gajus/redux-immutable
        if (action.type === LOCATION_CHANGE) {
            return state.merge({locationBeforeTransitions: action.payload});
        }
        return state;
    }
}), Immutable.Map({routing: INITIAL_STATE}), compose(DevTools.instrument()));

export default Store;
