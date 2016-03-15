import React from 'react';

import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';
import Log from 'components/log';
import Util from 'components/util';
import Toast from 'components/toast';

const USER_REMOVED = 'User deleted. You will now be redirected.';
const CONFIRM_DELETE = 'Are you sure you want to delete? This action cannot be undone.';
const DELETE = 'Delete';
const ERRORS = {
    BAD_DELETE: 'Sorry, there was a problem deleting. Please refresh and try again.'
};

var Page = React.createClass({
    getDefaultProps: function () {
        return {base: '/'};
    },
    getInitialState: function () {
        return {};
    },
    componentDidMount: function () {
        this.setupState(this.props);
    },
    componentWillReceiveProps: function (nextProps) {
        this.setupState(nextProps);
    },
    setupState: function (props) {
        var state = {};
        state.base = props.base;
        state.uuid = props.uuid || props.id;
        state.canDelete = props.canDelete != null ? props.canDelete : Util.decodePermissions(props.scope).delete;
        this.setState(state);
    },
    suspendAccount: function () {
        if (window.confirm(CONFIRM_DELETE)) { //eslint-disable-line no-alert
            HttpManager.DELETE({url: GLOBALS.API_URL.slice(0, -1) + this.state.base + '/' + this.state.uuid})
                .then(() => {
                    Toast.success(USER_REMOVED);
                })
                .catch(err => {
                    Toast.error(ERRORS.BAD_DELETE);
                    Log.error('User not deleted: ' + err.message, err);
                });
        }
    },
    render: function () {
        if ((!this.state.canDelete && !this.state.scope) || (this.state.uuid == null && this.state.id == null)) {
            return null;
        }
        return (
            <p>
                <a onClick={this.suspendAccount}>{DELETE}</a>
            </p>
        );
    }
});

export default Page;

