import _ from 'lodash';

import GLOBALS from 'components/globals';
import Log from 'components/log';
import HttpManager from 'components/http_manager';
import PrivateRoutes from 'private_routes';
import History from 'components/history';
import EventManager from 'components/event_manager';
//var PrivateRoutes = [];

class _Authorization {
    constructor(options = {}){
        var route = window.location.pathname;
        var self = this;
        route = route.indexOf('/') === 0 ? route.slice(1) : route;
        route = route[route.length - 1] === '/' ? route.slice(0, route.length - 1) : route;

        options.onChangeUser = options.onChangeUser || _.noop;
        this._userLoaded = new Promise(function (resolve) {
            self._resolve = resolve;
        });
        if (window.location.pathname !== '/' && _.reduce(PrivateRoutes, (acc, path) => acc || path.path.indexOf(route) === 0, false)) {
            this.reloadUser();
        }
    }
    logout() {
        window.localStorage.setItem('com.cmwn.platform.userName', null);
        window.localStorage.setItem('com.cmwn.platform.userId', null);
        window.localStorage.setItem('com.cmwn.platform.profileImage', null);
        window.localStorage.setItem('com.cmwn.platform.roles', null);
        Log.info('User logout successful');
        EventManager.update('userChanged', null);
    }
    reloadUser() {
        var getUser = HttpManager.GET({url: `${GLOBALS.API_URL}`, handleErrors: false});
        return getUser.then(res => {
            if (res && res.status === 401 && res.response && res.response.error && res.response.error.code === 'RESET_PASSWORD') {
                if (~window.location.href.indexOf('change-password')) {
                    return Promise.resolve();
                }
                window.location.href = '/change-password';
                return Promise.resolve();
            }
            window.localStorage.setItem('com.cmwn.platform.userName', res.response.data.username);
            window.localStorage.setItem('com.cmwn.platform.userId', res.response.data.uuid);
            if (res.response.data.roles) {
                window.localStorage.setItem('com.cmwn.platform.roles', res.response.data.roles.data);
            }
            if (res.response.data.images && res.response.data.images.data.length && _.isString(_.last(res.response.data.images.data).url)) {
                window.localStorage.setItem('com.cmwn.platform.profileImage', _.last(res.response.data.images.data).url);
            } else {
                window.localStorage.setItem('com.cmwn.platform.profileImage', GLOBALS.DEFAULT_PROFILE);
            }
            this._resolve(res.response.data);
            EventManager.update('userChanged', res.response.data.uuid);

            Log.info(`User ${res.response.data.uuid} authorized`);

            //configure trackers to logged in user
            Rollbar.configure({payload: {person: {id: res.response.data.uuid, username: res.response.data.username}}}); //eslint-disable-line no-undef
            return Promise.resolve(res.response.data);
        }).catch(e => {
            Log.log(e, 'Error encountered during authorization check. Logging out.');
            //user is not logged in.
            //this.logout();
            //if (window.location.pathname !== '/login' && window.location.pathname !== '/login/') {
                //History.replace('/login');
            //    this._resolve();
            //}
        });
    }
    get currentUser() {
        return {
            username: window.localStorage['com.cmwn.platform.userName'],
            roles: window.localStorage['com.cmwn.platform.roles'],
            profileImage: window.localStorage['com.cmwn.platform.profileImage'],
            uuid: window.localStorage['com.cmwn.platform.userId']
        };
    }
    get userIsLoaded() {
        return this._userLoaded;
    }
}

var Authorization = new _Authorization();

export default Authorization;

