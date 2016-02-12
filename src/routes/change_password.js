import React from 'react';

import Authorization from 'components/authorization';
import HttpManager from 'components/http_manager';
import Log from 'components/log';
import History from 'components/history';
import Toast from 'components/toast';
import GLOBALS from 'components/globals';
import {Panel, Button, Input} from 'react-bootstrap';

import Layout from 'layouts/one_col';

const HEADINGS = {
    EDIT_TITLE: 'Info',
    PASSWORD: 'Update Password'
};
const ERRORS = {
    BAD_PASS: 'Sorry, there was a problem updating your password.',
    NO_MATCH: 'Those passwords do not appear to match. Please try again.'
};
const CHANGE_COPY = 'You are required to change your password before using ChangeMyWorldNow.com. Please update your password using the form below to proceed.';

var Page = React.createClass({
    getInitialState: function () {
        this.uuid = Authorization.currentUser.uuid;
        return {};
    },
    render: function () {
        return (
           <Layout className="change-password">
                {CHANGE_COPY}
                <ChangePassword uuid={this.uuid} />
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
    submit: function () {
        if (this.state.confirm === this.state.new) {
            var update = HttpManager.POST({url: `${GLOBALS.API_URL}/auth/password`, handleErrors: false}, {
                'current_password': this.state.current,
                'password': this.state.new,
                'password_confirmation': this.state.confirm,
                'user_id': this.props.uuid,
                'user_uuid': this.props.uuid
            });
            update.then(() => {
                History.replaceState(null, '/profile?message=updated');
            }).catch(err => {
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
            <Panel header={HEADINGS.PASSWORD} className="standard">
                <form>
                <Input
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
        );
    }
});

export default Page;


