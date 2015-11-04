import GLOBALS from 'components/globals';

class _Authorization {
    constructor(){
        this.currentUserName = GLOBALS.CURRENT_USER.NAME;
        this.currentUserId = GLOBALS.CURRENT_USER.ID;
    }
}

var Authorization = new _Authorization();

export default Authorization;

