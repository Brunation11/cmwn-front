/* eslint-disable max-lines */
import React from 'react';
import _ from 'lodash';
import {Button, Input, Panel} from 'react-bootstrap';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import Moment from 'moment';

import Actions from 'components/actions';
import HttpManager from 'components/http_manager';
import Log from 'components/log';
import Toast from 'components/toast';
import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals';
import Util from 'components/util';
import UpdateUsername from 'components/update_username';
import ProfileImage from 'components/profile_image';
import Form from 'components/form';
import DropdownDatepicker from 'components/dropdown_datepicker';
import ACTION_CONSTANTS from 'components/action_constants';
import ChangePassword from 'components/change_password';


import 'routes/users/edit.scss';

var mapStateToProps;
var Page;
var CodeChange;

const HEADINGS = {
    EDIT_TITLE: 'Edit User: ',
    CURRENT_USERNAME: 'CURRENT USERNAME IS:',
    UPDATE_CODE: 'Update Code'
};
const ERRORS = {
    BAD_DELETE: 'Sorry, there was a problem deleting the user. Please refresh and try again.',
    BAD_RESET: 'This users password could not be reset at this time. Please try again later.'
};
/* eslint-disable max-len */
const SUSPEND = 'Delete Account';
const INVALID_SUBMISSION = 'Invalid submission. Please update fields highlighted in red and submit again';
const BAD_UPDATE = 'There was a problem updating your profile. Please try again later.';
const USER_REMOVED = 'User deleted. You will now be redirected.';
const CONFIRM_DELETE = 'Are you sure you want to delete this user? This action cannot be undone.';
const CODE_UPDATED = 'Code Reset for user. They will need to update their password on next login. Be sure to inform the user, as this code will expire in 24 hours.';
/* eslint-enable max-len */

export var decodeEditingPermissions = function (isStudent) {
    var canEdit = false;
    var perms = {
        username: {
            canView: true,
            canEdit: false
        },
        firstName: {
            canView: true,
            canEdit: false
        },
        lastName: {
            canView: true,
            canEdit: false
        },
        email: {
            canView: false,
            canEdit: false
        },
        birthday: {
            canView: true,
            canEdit: false
        },
        gender: {
            canView: false,
            canEdit: false
        },
        password: {
            canView: false,
            canEdit: false
        }
    };

    if (!isStudent) {
        perms.username.canEdit = true;
        perms.firstName.canEdit = true;
        perms.lastName.canEdit = true;
        perms.birthday.canEdit = true;
        perms.password.canEdit = true;
    }

    // check if any fields are editable
    canEdit = _.reduce(Object.keys(perms), (overall, k) => { return overall || perms[k].canEdit; }, false);
    perms.canEdit = canEdit;
    return perms;
};

export class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        var state;
        var isStudent;
        state = _.isObject(this.props.data) && !_.isArray(this.props.data) ? this.props.data : {};
        isStudent = props.isStudent !== null && props.isStudent !== undefined ? props.isStudent : true;
        this.state = _.defaults({}, state, {isStudent: isStudent, dob: new Date().toISOString()});
    }

    componentDidMount() {
        var state;
        if (this.props.data && this.props.data.birthdate) {
            state = _.defaults({}, this.props.data, {dob: new Date(this.props.data.birthdate).toISOString()});
        } else {
            state = this.props.data;
        }
        this.setState(state);
        this.resolveRole(this.props);
    }

    componentWillReceiveProps(nextProps) {
        var state;
        if (nextProps.data && nextProps.data.birthdate) {
            state = _.defaults({}, nextProps.data, {dob: new Date(nextProps.data.birthdate).toISOString()});
        } else {
            state = nextProps.data;
        }
        this.setState(state);
        this.resolveRole(nextProps);
    }

    resolveRole(props) {
        if (props.currentUser && props.currentUser.type && props.currentUser.type !== 'CHILD') {
            this.setState({isStudent: false});
        } else {
            this.setState({isStudent: true});
        }
    }

    suspendAccount() {
        if (window.confirm(CONFIRM_DELETE)) { //eslint-disable-line no-alert
            HttpManager.DELETE({url: `${GLOBALS.API_URL}user/${this.state.user_id}`, handleErrors: false})
                .then(Toast.success.bind(this, USER_REMOVED))
                .catch(err => {
                    Toast.error(ERRORS.BAD_DELETE);
                    Log.error(`User not deleted: ${err.message}`, err);
                });
        }
    }

    submit() {
        var birthdate = Moment(this.state.birthdate);
        /** @TODO MPR, 3/18/16: Remove unneeded fields*/

        var postData = {
            username: this.state.username,
            first_name: this.state.first_name, //eslint-disable-line camelcase
            last_name: this.state.last_name //eslint-disable-line camelcase
        };

        postData.email = this.state.email;
        postData.gender = this.state.gender;
        postData.type = this.state.type;
        if (birthdate.isValid()) postData.birthdate = birthdate.format('YYYY-MM-DD');

        if (this.refs.formRef.isValid()) {
            HttpManager.PUT(`${GLOBALS.API_URL}user/${this.state.user_id}`, postData)
            .then(() => {
                Toast.success('Profile Updated');
                Actions.dispatch[ACTION_CONSTANTS.UPDATE_USERNAME]({'username': this.state.username});
            }).catch(err => {
                Toast.error(`${BAD_UPDATE} ${err.message ? `Message: ${err.message}` : ''}`);
                Log.log('Server refused profile update', err, postData);
            });
        } else {
            Toast.error(INVALID_SUBMISSION);
        }
    }

    renderUsernameGenerator() {
        return (
            <div>HELLO WORLD</div>
        );
    }

    renderEmail() {
        return (
            <Input
                type="text"
                value={this.state.email}
                placeholder="Email"
                label="EMAIL"
                ref="emailInput"
                validate="required"
                name="emailInput"
                validationEvent="onBlur"
                disabled
                hasFeedback
            />
        );
    }

    renderFirstName(perms) {
        return (
            <Input
                ref="firstnameInput"
                name="firstnameInput"
                type="text"
                value={this.state.first_name}
                placeholder="first name"
                label="FIRST NAME"
                validate="required"
                validationEvent="onBlur"
                hasFeedback
                disabled={!perms.firstName.canEdit}
                onChange={
                    e => this.setState({
                        first_name: e.target.value //eslint-disable-line camelcase
                    })
                }
            />
        );
    }

    renderLastName(perms) {
        return (
            <Input
                ref="lastnameInput"
                name="lastnameInput"
                type="text"
                value={this.state.last_name}
                placeholder="last name"
                label="LAST NAME"
                validate="required"
                validationEvent="onBlur"
                hasFeedback
                disabled={!perms.lastName.canEdit}
                onChange={
                    e => this.setState({
                        last_name: e.target.value //eslint-disable-line camelcase
                    })
                }
            />
        );
    }

    renderBirthday(perms) {
        return (
            <DropdownDatepicker
                ref="dropdownDatepicker"
                label="Birthday: "
                disabled={!perms.birthday.canEdit}
                value={this.state.dob}
                hasFeedback
                onChange={
                    date => {
                        this.setState({
                            dob: date,
                            birthdate: Date.parse(date)
                        });
                    }
                }
            />
        );
    }

    rendedGender(perms) {
        return (
            <Input
                type="select"
                value={this.state.gender}
                placeholder="Gender"
                label="GENDER"
                validate="required"
                ref="genderInput"
                name="genderInput"
                disabled={!perms.gender.canEdit}
                onChange={
                    e => this.setState({
                        gender: e.target.value
                    })
                }
            >
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
            </Input>
        );
    }

    renderFormSubmit() {
        return (
            <Button className="update-user-metadata-btn" onClick={this.submit.bind(this)}>Save</Button>
        );
    }

    renderUserFields() {
        var perms = decodeEditingPermissions(this.state.isStudent);
        // refactor update username to use component
        // {perms.username.canEdit ? this.renderEditableUsername() : null}
        // {!perms.username.canEdit && perms.username.canView ? this.renderStaticUsername() : null}
        return (
            <div>
                <div className="username-container">
                    <UpdateUsername
                        className={ClassNames(
                            'username-genetator', {
                                hidden: this.props.currentUser.type !== 'CHILD'
                            }
                        )}
                        currentUser={this.props.currentUser}
                        data={this.props.data}
                    />
                    <span className="username-display">
                        <h1 className="username-label">USERNAME</h1>
                        <span className="username">{this.state.username.toUpperCase()}</span>
                    </span>
                </div>
                <Form ref="formRef">
                    {perms.email.canView ? this.renderEmail() : null}
                    {perms.firstName.canView ? this.renderFirstName(perms) : null}
                    {perms.lastName.canView ? this.renderLastName(perms) : null}
                    {perms.birthday.canView ? this.renderBirthday(perms) : null}
                </Form>
                {perms.canEdit ? this.renderFormSubmit.call(this) : null}
            </div>
        );
    }

    render() {
        var perms = decodeEditingPermissions(this.state.isStudent);
        if (this.props.data == null ||
            this.props.data.user_id == null ||
            !Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }

        return (
            <Layout currentUser={this.props.currentUser} className="edit-profile">
                <Panel
                    header={`${HEADINGS.EDIT_TITLE} ${this.state.first_name} ${this.state.last_name}`}
                    className="standard edit-profile"
                >
                    <div className="left profile-image-container">
                        <ProfileImage
                            data={this.props.data}
                            currentUser={this.props.currentUser}
                            link-below={true}
                        />
                        <p className={ClassNames('action-link', {hidden:
                            !Util.decodePermissions(this.props.data.scope).delete})}>
                            <a onClick={this.suspendAccount.bind(this)}>{SUSPEND}</a>
                        </p>
                    </div>

                    <div className="right user-fields">
                        {this.renderUserFields()}
                    </div>

                    <div className="current-username-container">
                        <h1 className="username-label">{HEADINGS.CURRENT_USERNAME}</h1>
                        <span className="username">{this.state.username.toUpperCase()}</span>
                    </div>

                    <ChangePassword
                        className="test"
                        user_id={this.state.user_id}
                        url={this.state._links.password}
                        currentUser={this.props.currentUser}
                        confirmReLogin={true}
                    />

                    <CodeChange
                        endpoint={_.get(this, 'state._links.reset.href')}
                        updatingUserEmail={this.state.email}
                        currentUserEmail={this.props.currentUser.email}
                        canEdit={perms.password.canEdit}
                    />
                </Panel>
            </Layout>
        );
    }
}

CodeChange = React.createClass({
    getInitialState: function () {
        return {code: ''};
    },
    submit: function () {
        var update = HttpManager.POST({url: this.props.endpoint}, {
            'email': this.props.email,
            'code': this.state.code
        });
        update.then(() => {
            Toast.success(CODE_UPDATED);
        }).catch(err => {
            Log.warn('Update password failed.' + (err.message ? ' Message: ' + err.message : ''), err);
            Toast.error(ERRORS.BAD_PASS);
        });
    },
    render: function () {
        if (
            !this.props.canEdit ||
            this.props.endpoint == null ||
            this.props.updatingUserEmail === this.props.currentUserEmail
        ) {
            return null;
        }
        return (
            <Panel header={HEADINGS.UPDATE_CODE} className="standard"><form>
                    <Input
                        type="text"
                        value={this.state.code}
                        placeholder="code"
                        label="Reset Code"
                        validate="required"
                        ref="currentInput"
                        name="currentInput"
                        onChange={e => this.setState({code: e.target.value})}
                    />
                    <Button onClick={this.submit}>Reset Code</Button>
            </form></Panel>
        );
    }
});

mapStateToProps = state => {
    var data = {};
    var currentUser = {};
    var loading = true;
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
    }
    if (currentUser != null) {
        currentUser = state.currentUser;
    }
    return {
        data,
        currentUser,
        loading
    };
};

Page = connect(mapStateToProps)(EditProfile);
export default Page;
