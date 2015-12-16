import _ from 'lodash';

import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';
import PrivateRoutes from 'private_routes';
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
    reloadUser() {
        var getUser = HttpManager.GET({url: `${GLOBALS.API_URL}users/me`});
        getUser.then(res => {
            window.localStorage.setItem('fullName', res.response.data.first_name + ' ' + res.response.data.last_name);
            window.localStorage.setItem('userName', res.response.data.username);
            window.localStorage.setItem('userId', res.response.data.uuid);
            this._resolve(res.response.data);
            EventManager.update('userChanged', res.response.data.uuid);
        }).catch(() => {
            //user is not logged in.
            window.localStorage.setItem('userName', null);
            window.localStorage.setItem('userId', null);
            window.localStorage.setItem('fullName', null);
            EventManager.update('userChanged', null);
            if (window.location.pathname !== '/login' && window.location.pathname !== '/login/') {
                History.replaceState(null, '/login');
                this._resolve();
            }
        });
    }
    get currentUser() {
        return {
            fullname: window.localStorage.fullName,
            username: window.localStorage.userName,
            uuid: window.localStorage.userId
        };
    }
    get userIsLoaded() {
        return this._userLoaded;
    }
}

var Authorization = new _Authorization();

export default Authorization;

