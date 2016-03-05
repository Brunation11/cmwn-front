import _ from 'lodash';
/** This file exists to resolve a circular dependency between the store and action components*/
const ACTIONS = [
    'PATH_CHANGE',
    'HASH_CHANGE',
    'SEARCH_CHANGE',
    'PAGE_TITLE',
    'START_PAGE_DATA',
    'END_PAGE_DATA',
    'START_AUTHORIZE_APP',
    'END_AUTHORIZE_APP'
];

export default _.reduce(ACTIONS, (a, i) => _.defaults(a, {[i]: i}), {});

