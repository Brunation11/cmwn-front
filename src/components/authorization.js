import _ from 'lodash';

import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';

class _Authorization {
    constructor(options = {}){
        options.onChangeUser = options.onChangeUser || _.noop;
        this.currentUser = {};
        this.currentUser.name = GLOBALS.CURRENT_USER.NAME;
        this.currentUser.id = GLOBALS.CURRENT_USER.ID;
        this._userLoaded = new Promise( (resolve, rej) => {
            var getUser = HttpManager.GET({url: `${GLOBALS.API_URL}/users/me`});
            getUser.then(res => {
                this.currentUser.name = res.response.data.first_name + ' ' + res.response.data.last_name;
                this.currentUser.id = res.response.data.id;
                resolve(res.response.data);
            });
        });
    }
    get userIsLoaded() {
        return this._userLoaded;
    }
}

var Authorization = new _Authorization();

export default Authorization;

