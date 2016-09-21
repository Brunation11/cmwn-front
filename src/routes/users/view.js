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

var mapStateToProps;
var Page;

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

export class ProfileView extends React.Component {
    constructor(props) {
        super(props);
        this.state = _.isObject(this.props.data) && !_.isArray(this.props.data) ? this.props.data : {};
        this.state.isStudent = true;
    }

    componentDidMount() {
        this.setState(this.props.data);
        this.resolveRole();
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.data);
        this.resolveRole();
    }

    suspendAccount() {
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
    }

    resolveRole() {
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
    }

    render() {
        if (this.props.data.username == null || !Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        return (
            <Layout currentUser={this.props.currentUser} className="edit-student">
                <Panel header={HEADINGS.EDIT_TITLE + this.state.first_name + ' ' + this.state.last_name}
                       className="standard edit-profile">
                    <div className="left">
                        <ProfileImage
                            data={this.props.data}
                            currentUser={this.props.currentUser}
                            link-below={true}
                        />
                        <p><a onClick={this.suspendAccount.bind(this)}>{SUSPEND}</a></p>
                        <EditLink base="/user" uuid={this.state.user_id}
                            canUpdate={Util.decodePermissions(this.state.scope).update}/>
                    </div>
                    <div className="right">
                        <h2>{this.state.username}</h2>
                    </div>
                </Panel>
            </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = {};
    var loading = true;
    var currentUser = {};
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
    }
    if (state.currentUser) {
        currentUser = state.currentUser;
    }
    return {
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(ProfileView);
export default Page;
