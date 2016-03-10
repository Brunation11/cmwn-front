import _ from 'lodash';

import Log from 'components/log';
import HttpManager from 'components/http_manager';
import PrivateRoutes from 'private_routes';
import History from 'components/history';
import EventManager from 'components/event_manager';
import Store from 'components/store';
import Actions from 'components/actions';

/** Marked for deprecation. Should be moved/converted into the auth action in actions.js */
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
        //if (window.location.pathname !== '/' && _.reduce(PrivateRoutes, (acc, path) => acc || path.path.indexOf(route) === 0, false)) {
        //    this.reloadUser();
        //}
    }
    logout() {
        window.localStorage.setItem('com.cmwn.platform.userName', null);
        window.localStorage.setItem('com.cmwn.platform.userId', null);
        window.localStorage.setItem('com.cmwn.platform.profileImage', null);
        window.localStorage.setItem('com.cmwn.platform.roles', null);
        window.localStorage.setItem('com.cmwn.platform._links', null);
        Actions.LOGOUT();
        Log.info('User logout successful');
        EventManager.update('userChanged', null);
    }
    storeUser(user) {
        if (user == null) {
            user = Store.getState().currentUser;
        }
        window.localStorage.setItem('com.cmwn.platform.userName', JSON.stringify(user.username));
        window.localStorage.setItem('com.cmwn.platform.userId', JSON.stringify(user.user_id));
        window.localStorage.setItem('com.cmwn.platform._links', JSON.stringify(user._links));
        //@TODO MPR, 3/7/16: Need to actually recieve these two fields
        //if (res.response.data.roles) {
        //    window.localStorage.setItem('com.cmwn.platform.roles', res.response.data.roles.data);
        //}
        //if (res.response.data.images && res.response.data.images.data.length && _.isString(_.last(res.response.data.images.data).url)) {
        //    window.localStorage.setItem('com.cmwn.platform.profileImage', _.last(res.response.data.images.data).url);
        //} else {
        //    window.localStorage.setItem('com.cmwn.platform.profileImage', GLOBALS.DEFAULT_PROFILE);
        //}
        this._resolve(user);
        EventManager.update('userChanged', user.user_id);

        Log.info(`User ${user.user_id} authorized`);

        //configure trackers to logged in user
        Rollbar.configure({payload: {person: {id: user.user_id, username: user.username}}}); //eslint-disable-line no-undef
        return Promise.resolve(user);
    }
    reloadUser(newUser) {
        var getUser;
        if (newUser != null) {
            return this.storeUser(newUser);
        } else {
            getUser = HttpManager.GET({url: Store.getState().currentUser._links.me.href});
            return getUser.then(res => {
                //@TODO MPR, 3/7/16: This should move to errors.js
                if (res && res.status === 401 && res.response && res.response.error && res.response.error.code === 'RESET_PASSWORD') {
                    if (~window.location.href.indexOf('change-password')) {
                        return Promise.resolve();
                    }
                    window.location.href = '/change-password';
                    return Promise.resolve();
                }
                return this.storeUser(res.response);
            }).catch(e => {
                Log.log(e, 'Error encountered during authorization check. Logging out.');
                //user is not logged in.
                this.logout();
                if (window.location.pathname !== '/login' && window.location.pathname !== '/login/') {
                    History.push('/login');
                    this._resolve();
                }
            });
        }
    }
    get currentUser() {
        var state = Store.getState();
        if (state.currentUser == null) {
            return {};
        }
        return {
            username: state.currentUser.username,
            roles: state.currentUser.roles,
            profileImage: state.currentUser.image,
            uuid: state.currentUser.user_id
        };
    }
    get userIsLoaded() {
        return this._userLoaded;
    }
}

var Authorization = new _Authorization();

export default Authorization;

