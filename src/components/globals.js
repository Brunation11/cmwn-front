/**
 * Globals.js
 * Exists to expose constants to the rest of the application
 * In the future, we may want to move/extend this to something that can
 * be modified by the user environment so that local environment
 * variables can be exposed to local js
 */
import _ from 'lodash';

import DefaultProfile from 'media/profile_tranparent.png';

const GLOBALS = _.defaults(window.__cmwn, {
    API_URL: 'http://api.changemyworldnow.com/',
    DEFAULT_PROFILE: DefaultProfile,
    CURRENT_USER: {
        PROFILE_IMAGE: 'https://upload.wikimedia.org/wikipedia/commons/1/17/F%C3%ABdor_Ivanovi%C4%8D_%C5%A0aljapin_as_Farlaf_by_Alexandr_Golovin.jpg'
    },
    TOP_NAV: [
        {URL: '/', TEXT: 'Home'},
        {URL: '/members', TEXT: 'Members'},
        {URL: '/roles', TEXT: 'Roles'},
        {URL: '/districts', TEXT: 'Districts'},
        {URL: '/orgainizations', TEXT: 'Organizations'},
        {URL: '/groups', TEXT: 'Groups'},
        {URL: 'uploadcsv', TEXT: 'Upload CSV'},
        {URL: '/playground', TEXT: 'Cloudinary Image'}
    ],
    PAGINATOR_COUNTS: [10, 25, 50, 250],
    TOAST_DEFAULT_TIMEOUT: 2000
});

export default GLOBALS;

