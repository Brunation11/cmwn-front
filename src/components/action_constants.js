import _ from 'lodash';
/** This file exists to resolve a circular dependency between the store and action components*/
const ACTIONS = [
    'LOGOUT',
    'PATH_CHANGE',
    'FINISH_BOOTSTRAP',
    'HASH_CHANGE',
    'SEARCH_CHANGE',
    'PAGE_TITLE',
    'PAGE_LOADING',
    'PAGE_LOADED',
    'PAGE_INITIALIZED',
    'PAGE_DATA',
    'START_PAGE_DATA',
    'END_PAGE_DATA',
    'AUTHORIZE_APP',
    'START_AUTHORIZE_APP',
    'END_AUTHORIZE_APP',
    'START_COMPONENT_DATA',
    'END_COMPONENT_DATA',
    'COMPONENT_LOADING',
    'COMPONENT_LOADED',
    'REGISTER_COMPONENT',
    'LOADER_SUCCESS',
    'LOADER_START',
    'LOADER_ERROR'
];

export default _.reduce(ACTIONS, (a, i) => _.defaults(a, {[i]: i}), {});

