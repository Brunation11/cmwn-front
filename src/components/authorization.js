import _ from 'lodash';

import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';
import PrivateRoutes from 'private_routes';
//var PrivateRoutes = [];

class _Authorization {
    constructor(options = {}){
        var route = window.location.pathname;
        route = route.indexOf('/') === 0 ? route.slice(1) : route;
        route = route[route.length - 1] === '/' ? route.slice(0, route.length - 1) : route;

        options.onChangeUser = options.onChangeUser || _.noop;
        this.currentUser = {};
        this.currentUser.name = window.localStorage.userName;
        this.currentUser.uuid = window.localStorage.userId;
        this._userLoaded = Promise.resolve();
        if (window.location.pathname !== '/' && _.reduce(PrivateRoutes, (acc, path) => acc || path.path.indexOf(route) === 0, false)) {
            this.reloadUser();
        }
    }
    reloadUser() {
        this._userLoaded = new Promise( (resolve) => { //eslint-disable-line no-unused-vars
            var getUser = HttpManager.GET({url: `${GLOBALS.API_URL}users/me`});
            getUser.then(res => {
                this.currentUser.name = res.response.data.first_name + ' ' + res.response.data.last_name;
                window.localStorage.setItem('userName', res.response.data.first_name + ' ' + res.response.data.last_name);
                this.currentUser.uuid = res.response.data.uuid;
                window.localStorage.setItem('userId', res.response.data.uuid);
                resolve(res.response.data);
            }).catch(() => {
                //user is not logged in.
                window.localStorage.setItem('userName', null);
                window.localStorage.setItem('userId', null);
                window.localStorage.setItem('fullName', null);
                if (window.location.pathname !== '/login' && window.location.pathname !== '/login/') {
                    History.replaceState(null, '/login');
                    resolve();
                }
            });
        });
    }
    get userIsLoaded() {
        return this._userLoaded;
    }
}

var Authorization = new _Authorization();

export default Authorization;

