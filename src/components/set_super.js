import React from 'react';
import {Button} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Log from 'components/log';

const HEADINGS = {
    MAKE_SUPER: 'Give super admin privileges',
    SUPER: 'This user is a super admin',
    REVOKE_SUPER: 'Revoke super admin privileges'
};
const CONFIRM = [
    'Are you sure that you want to revoke the super admin privileges of this user?',
    'Are you sure that you want to make this user super?'
];
const ERRORS = {
    BAD_UPDATE: 'Sorry, there was a problem making this user super'
};

class SetSuper extends React.Component {
    constructor(props) {
        super();
        if (props && props.data) {
            this.state = props.data;
            this.state.super = null;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.data || !nextProps.data._links || !nextProps.data._links.super) {
            return;
        }
        nextProps.data.super = null;
        HttpManager.GET(
            `${nextProps.data._links.super.href}/${nextProps.data.user_id}`
        ).then(() => {
            nextProps.data.super = true;
            this.setState(nextProps.data);
        }).catch(err => {
            if (err.status === 404) {
                nextProps.data.super = false;
                this.setState(nextProps.data);
            }
            Log.warn(err.message ? err.message : '', err);
        });
    }

    submit(superFlag) {
        var update;

        if (window.confirm(CONFIRM[superFlag | 0])) { //eslint-disable-line no-alert
            update = HttpManager.POST({url: this.state._links.super_flag.href},
                {super: superFlag}
            );
            update.then(() => {
                Toast.success('The super status is updated');
                this.setState({super: superFlag});
            }).catch(err => {
                Log.warn('Update code failed.' + (err.message ? ' Message: ' + err.message : ''), err);
                Toast.error(ERRORS.BAD_UPDATE);
            });
        }
    }

    render() {
        if (!this.state || this.state.super === null) {
            return null;
        }

        if (this.state.super === true) {
            return (
                <div className="right">
                    {HEADINGS.SUPER}
                    <br/><br/>
                    <Button onClick={this.submit.bind(this, false)} className="purple standard right">
                        {HEADINGS.REVOKE_SUPER}
                    </Button>
                    <br/><br/>
                </div>
            );
        }
        return (
            <div className="right">
                <Button onClick={this.submit.bind(this, true)} className="purple standard right">
                    {HEADINGS.MAKE_SUPER}
                </Button>
                <br/><br/>
            </div>
        );
    }
}

export default SetSuper;
