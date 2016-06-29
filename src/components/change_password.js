import React from 'react';
import {Button, Input, Panel} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Log from 'components/log';

const HEADINGS = {
    PASSWORD: 'Update Password'
};

const ERRORS = {
    BAD_PASS: 'Sorry, there was a problem updating your password.',
    NO_MATCH: 'Those passwords do not appear to match. Please try again.',
    TOO_SHORT: 'Passwords must contain at least 8 characters, including one number',
};

const PASS_UPDATED = '<p id="showMsg">You have successfully updated your password.' +
    '<br />Be sure to remember for next time!</p>';

var isPassValid;

class ChangePassword extends React.Component {
    constructor() {
        super();
        this.state = {
            current: '',
            new: '',
            confirm: '',
            extraProps: {}
        };
    }

    submit() {
        var update;
        if (!isPassValid(this.state.new)) {
            this.setState({extraProps: {bsStyle: 'error'}});
            Toast.error(ERRORS.TOO_SHORT);
        } else if (this.state.confirm === this.state.new) {
            update = HttpManager.POST({url: this.props.url.href}, {
                'current_password': this.state.current,
                'password': this.state.new,
                'password_confirmation': this.state.confirm,
                'user_id': this.props.user_id,
            });
            update.then(
                Toast.success.bind(this, PASS_UPDATED)
            ).catch(err => {
                Log.warn('Update password failed.' + (err.message ? ' Message: ' + err.message : ''), err);
                Toast.error(ERRORS.BAD_PASS);
            });
        } else {
            this.setState({extraProps: {bsStyle: 'error'}});
            Toast.error(ERRORS.NO_MATCH);
            /** @TODO MPR, 11/19/15: check on change, not submit*/
        }
    }

    render() {
        if (this.props.currentUser.user_id !== this.props.user_id ||
            this.props.url == null ||
            this.props.url.href == null
        ) {
            return null;
        }
        return (
            <Panel header={HEADINGS.PASSWORD} className="standard">
            <form>
            <Input
                id="oldPass"
                type="password"
                value={this.state.current}
                placeholder="********"
                label="Current Password"
                validate="required"
                ref="currentInput"
                name="currentInput"
                onChange={e => this.setState({current: e.target.value})}
            />
            <Input
                id="newPass"
                type="password"
                value={this.state.new}
                placeholder="********"
                label="New Password"
                validate="required"
                ref="newInput"
                name="newInput"
                onChange={e => this.setState({new: e.target.value})}
                {...this.state.extraProps}
            />
            <Input
                id="confirmPass"
                type="password"
                value={this.state.confirm}
                placeholder="********"
                label="Confirm Password"
                validate="required"
                ref="confirmInput"
                name="confirmInput"
                onChange={e => this.setState({confirm: e.target.value})}
                {...this.state.extraProps}
            />
            <Button onClick={this.submit.bind(this)} id="updateBtn">Update</Button>
            </form>
        </Panel>
        );
    }
}

isPassValid = function (password) {
    return password.length >= 8 && ~password.search(/[0-9]+/);
};

export default ChangePassword;
