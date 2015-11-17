import GLOBALS from 'components/globals';

class _Authorization {
    constructor(){
        this.currentUser = {};
        this.currentUser.name = GLOBALS.CURRENT_USER.NAME;
        this.currentUser.id = GLOBALS.CURRENT_USER.ID;
    }
}

var Authorization = new _Authorization();

export default Authorization;

