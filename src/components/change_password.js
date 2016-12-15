import React from 'react';
import {Button, Input, Panel} from 'react-bootstrap';
import SweetAlert from 'sweetalert2';

import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Log from 'components/log';

const HEADINGS = {
    PASSWORD: 'Update Password'
};

export const ERRORS = {
    BAD_PASS: 'Sorry, there was a problem updating your password.',
    NO_MATCH: 'Those passwords do not appear to match. Please try again.',
    TOO_SHORT: 'Passwords must contain at least 8 characters, including one number',
};

const PASS_UPDATED = '<p id="show-msg">You have successfully updated your password.' +
    '<br />Be sure to remember for next time!</p>';

var isPassValid;

class ChangePassword extends React.Component {
    constructor() {
        super();
        this.state = {
            current: '',
            new: '',
            confirm: '',
            extraProps: {},
            type: 'password'
        };
    }

    handleOptionSelect(e) {
        if (this.state.type !== e.target.value) {
            this.setState({
                type: e.target.value
            });
        } else {
            this.setState({
                type: 'password'
            });
        }
    }

    submit() {
        if (!isPassValid(this.state.new)) {
            this.setState({extraProps: {bsStyle: 'error'}});
            Toast.error(ERRORS.TOO_SHORT);
        } else if (this.state.confirm === this.state.new) {
            HttpManager.POST({url: this.props.url.href}, {
                'current_password': this.state.current,
                'password': this.state.new,
                'password_confirmation': this.state.confirm,
                'user_id': this.props.user_id,
            }).then(() => {
                this.confirmReLogin();
            }).catch(err => {
                Log.warn('Update password failed.' + (err.message ? ' Message: ' + err.message : ''), err);
                Toast.error(ERRORS.BAD_PASS);
            });

            this.setState({
                current: '',
                new: '',
                confirm: ''
            });
        } else {
            this.setState({extraProps: {bsStyle: 'error'}});
            Toast.error(ERRORS.NO_MATCH);
            /** @TODO MPR, 11/19/15: check on change, not submit*/
        }
    }

    confirmReLogin() {
        Toast.success(PASS_UPDATED);
        if (this.props.confirmReLogin) {
            SweetAlert({
                animation: false,
                html: 'You will need to login again<br />for security purposes after resetting<br />your new password.', //eslint-disable-line max-len
                allowOutsideClickg: false,
                allowEscapeKey: false,
                customClass: 'confirm-re-login'
            });
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
            <Panel header={this.props.header ? HEADINGS.PASSWORD : ''} className="standard change-password">
                <form>
                    <Input
                        id="old-pass"
                        type={this.state.type}
                        value={this.state.current}
                        placeholder="PA******"
                        label="Current Password"
                        validate="required"
                        ref="currentInput"
                        name="currentInput"
                        onChange={e => this.setState({current: e.target.value})}
                        onFocus={e => e.target.placeholder = ''}
                        onBlur={e => e.target.placeholder = 'PA******'}
                        autoComplete="off"
                    />
                    <Input
                        id="new-pass"
                        type={this.state.type}
                        value={this.state.new}
                        placeholder="PA******"
                        label="New Password"
                        validate="required"
                        ref="newInput"
                        name="newInput"
                        onChange={e => this.setState({new: e.target.value})}
                        onFocus={e => e.target.placeholder = ''}
                        onBlur={e => e.target.placeholder = 'PA******'}
                        autoComplete="off"
                        {...this.state.extraProps}
                    />
                    <Input
                        id="confirm-pass"
                        type={this.state.type}
                        value={this.state.confirm}
                        placeholder="PA******"
                        label="Re-type Password"
                        validate="required"
                        ref="confirmInput"
                        name="confirmInput"
                        onChange={e => this.setState({confirm: e.target.value})}
                        onFocus={e => e.target.placeholder = ''}
                        onBlur={e => e.target.placeholder = 'PA******'}
                        autoComplete="off"
                        {...this.state.extraProps}
                    />
                    <Input
                        type="radio"
                        ref="show-pass"
                        name="toggle"
                        className="toggle-characters"
                        label="Check to show password characters"
                        value="text"
                        checked={this.state.type === 'text'}
                        onChange={this.handleOptionSelect.bind(this)}
                    />
                    <Button
                        id="update-btn"
                        className="update-password-btn"
                        onClick={this.submit.bind(this)}
                    >
                        Update
                    </Button>
                </form>
            </Panel>
        );
    }
}

isPassValid = function (password) {
    return password.length >= 8 && ~password.search(/[0-9]+/);
};

export default ChangePassword;
