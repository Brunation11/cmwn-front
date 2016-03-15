import React from 'react';
import _ from 'lodash';
import {Panel} from 'react-bootstrap';
import { connect } from 'react-redux';

import HttpManager from 'components/http_manager';
import Log from 'components/log';
import Toast from 'components/toast';
import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals';
import ProfileImage from 'components/profile_image';
import EditLink from 'components/edit_link';
import Util from 'components/util';

import 'routes/users/edit.scss';

const HEADINGS = {
    EDIT_TITLE: 'User Administration: ',
    PASSWORD: 'Update Password'
};
const ERRORS = {
    BAD_PASS: 'Sorry, there was a problem updating your password.',
    NO_MATCH: 'Those passwords do not appear to match. Please try again.',
    TOO_SHORT: 'Passwords must contain at least 8 characters, including one number',
    BAD_DELETE: 'Sorry, there was a problem deleting the user. Please refresh and try again.'
};
const SUSPEND = 'Delete Account';
const USER_REMOVED = 'User deleted. You will now be redirected.';
const CONFIRM_DELETE = 'Are you sure you want to delete this user? This action cannot be undone.';

var Component = React.createClass({
    getInitialState: function () {
        var state = _.isObject(this.props.data) && !_.isArray(this.props.data) ? this.props.data : {};
        state.isStudent = true;
        return state;
    },
    componentDidMount: function () {
        this.setState(this.props.data);
        this.resolveRole();
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState(nextProps.data);
        this.resolveRole();
    },
    suspendAccount: function () {
        if (window.confirm(CONFIRM_DELETE)) { //eslint-disable-line no-alert
            HttpManager.DELETE({url: GLOBALS.API_URL + 'users/' + this.state.user_id, handleErrors: false})
                .then(() => {
                    Toast.success(USER_REMOVED);
                })
                .catch(err => {
                    Toast.error(ERRORS.BAD_DELETE);
                    Log.error('User not deleted: ' + err.message, err);
                });
        }
    },
    resolveRole: function () {
        var newState = {};
        if (this.state.roles == null) {
            return;
        }
        if (~this.state.roles.data.indexOf('Student')) {
            newState.isStudent = true;
        } else {
            newState.isStudent = false;
        }
        this.setState(newState);
    },
    render: function () {
        if (this.props.data.username == null || !Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        return (
           <Layout className="edit-student">
                <Panel header={HEADINGS.EDIT_TITLE + this.state.first_name + ' ' + this.state.last_name} className="standard edit-profile">
                    <div className="left">
                        <ProfileImage user_id={this.state.user_id} link-below={true}/>
                        <p><a onClick={this.suspendAccount}>{SUSPEND}</a></p>
                        <EditLink base="/user" uuid={this.state.user_id} canUpdate={Util.decodePermissions(this.state.scope).update} />
                    </div>
                    <div className="right">
                        <h2>{this.state.username}</h2>
                    </div>
                </Panel>
            </Layout>
        );
    }
});

const mapStateToProps = state => {
    var data = {};
    var loading = true;
    if (state.page && state.page.data) {
        loading = state.page.loading;
        data = state.page.data;
    }
    return {
        data,
        loading
    };
};

var Page = connect(mapStateToProps)(Component);
export default Page;

