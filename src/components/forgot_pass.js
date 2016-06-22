import React from 'react';
import {Button, Panel} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Log from 'components/log';

const HEADINGS = {
    UPDATE_CODE: 'Reset code for user',
};

const ERRORS = {
    BAD_PASS: 'Sorry, there was a problem updating your password.',
};

//This forgot pass is for admins to manually code reset another adult
class ForgotPass extends React.Component {
    constructor() {
        super();
        this.state = {code: ''};
    }

    submit() {
        var update;
        if (this.props.data._links.forgot == null) {
            return;
        }
        update = HttpManager.POST({url: this.props.data._links.forgot.href }, {email: this.props.data.email});
        update.then(
            Toast.success.bind(this, 'Password reset code sent to user email.')
        ).catch(err => {
            Log.warn('Could not reset password at this time.' + (err.message ? ' Message: ' + err.message : ''), err);
            Toast.error(ERRORS.BAD_PASS);
        });
    }

    render() {
        if (this.props.currentUser.user_id === this.props.user_id || this.props.data._links.forgot == null) {
            return null;
        }
        return (
            <Panel header={HEADINGS.UPDATE_CODE} className="standard"><form>
                    <Button onClick={this.submit.bind(this)}>Reset Password</Button>
            </form></Panel>
        );
    }
}

export default ForgotPass;
