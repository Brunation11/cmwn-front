import _ from 'lodash';

import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';

class _Authorization {
    constructor(options = {}){
        options.onChangeUser = options.onChangeUser || _.noop;
        this.currentUser = {};
        this.currentUser.name = window.localStorage.userName || GLOBALS.CURRENT_USER.NAME;
        this.currentUser.id = window.localStorage.userId || GLOBALS.CURRENT_USER.ID;
        this._userLoaded = new Promise( (resolve) => { //eslint-disable-line no-unused-vars
            /** @TODO MPR, 11/19/15: handle failure */
            var getUser = HttpManager.GET({url: `${GLOBALS.API_URL}users/me`});
            getUser.then(res => {
                this.currentUser.name = res.response.data.first_name + ' ' + res.response.data.last_name;
                window.localStorage.setItem('userName', res.response.data.first_name + ' ' + res.response.data.last_name);
                this.currentUser.id = res.response.data.id;
                window.localStorage.setItem('userId', res.response.data.id);
                resolve(res.response.data);
            }).catch(() => {
                //user is not logged in.
                window.localStorage.setItem('userName', null);
                window.localStorage.setItem('userId', null);
                if (window.location.pathname === 'login' || window.location.pathname === 'login/') {
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

