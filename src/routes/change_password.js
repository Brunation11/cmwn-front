import React from 'react';

import HttpManager from 'components/http_manager';
import Log from 'components/log';
import History from 'components/history';
import Toast from 'components/toast';
import Store from 'components/store';
import GLOBALS from 'components/globals';
import {Panel, Button, Input} from 'react-bootstrap';

import Layout from 'layouts/one_col';

const HEADINGS = {
    EDIT_TITLE: 'Info',
    PASSWORD: 'Update Password'
};
const ERRORS = {
    BAD_PASS: 'Sorry, there was a problem updating your password.',
    TOO_SHORT: 'Passwords must contain at least 8 characters, including one number',
    NO_MATCH: 'Those passwords do not appear to match. Please try again.'
};
const CHANGE_COPY = `You are required to change your password before using ChangeMyWorldNow.com.
        Please update your password using the form below to proceed.`;


var isPassValid = function (password) {
    return password.length >= 8 && ~password.search(/[0-9]+/);
};

var Page = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function () {
        return (
           <Layout className="change-password">
                {CHANGE_COPY}
                <ChangePassword />
           </Layout>
         );
    }
});

var ChangePassword = React.createClass({
    getInitialState: function () {
        return {
            current: '',
            new: '',
            confirm: '',
            extraProps: {}
        };
    },
    componentDidMount: function () {
        var state = Store.getState();
        if (state.currentUser.user_id != null) {
            window.location.href = '/logout';
        }
    },
    submit: function () {
        var state = Store.getState();
        var update;
        if (state.currentUser.user_id != null) {
            window.location.href = '/logout';
        }
        if (!isPassValid(this.state.new)) {
            this.setState({extraProps: {bsStyle: 'error'}});
            Toast.error(ERRORS.TOO_SHORT);
        } else if (this.state.confirm === this.state.new) {
            update = HttpManager.POST({url: `${GLOBALS.API_URL}password`}, {
//                'current_password': this.state.current,
                'password': this.state.new,
                'password_confirmation': this.state.confirm
            });
            update.then(() => {
                History.replace('/profile?message=updated');
            }).catch(err => {
                if (err.status === 0) {
                    //non-error response from update password indicates password already changed successfully
                    History.replace('/profile?message=updated');
                }
                Log.warn('Update password failed.' + (err.message ? ' Message: ' + err.message : ''), err);
                Toast.error(ERRORS.BAD_PASS);
            });
        } else {
            this.setState({extraProps: {bsStyle: 'error'}});
            Toast.error(ERRORS.NO_MATCH);
            /** @TODO MPR, 02/11/16: check on change, not submit*/
        }
    },
    render: function () {
        return (
            <div>
                <Panel header={HEADINGS.PASSWORD} className="standard">
                    <form>
    {''/*                <Input
                        type="password"
                        value={this.state.current}
                        placeholder="********"
                        label="Current Password"
                        validate="required"
                        ref="currentInput"
                        name="currentInput"
                        onChange={e => this.setState({current: e.target.value})}
                    />
    */}
                    <Input
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
                    <Button onClick={this.submit}>Update</Button>
                    </form>
                </Panel>
            </div>
        );
    }
});

export default Page;


