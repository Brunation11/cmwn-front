import React from 'react';
import _ from 'lodash';
import {Button, Input, Panel} from 'react-bootstrap';
import { connect } from 'react-redux';
import DatePicker from 'react-bootstrap-date-picker';

import HttpManager from 'components/http_manager';
import Log from 'components/log';
import Toast from 'components/toast';
import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals';
import Validate from 'components/validators';
import Util from 'components/util';
import UpdateUsername from 'components/update_username';
import ProfileImage from 'components/profile_image';
import Form from 'components/form';
import Store from 'components/store';

import 'routes/users/edit.scss';

const HEADINGS = {
    EDIT_TITLE: 'Edit User: ',
    UPDATE_CODE: 'Reset code for user',
    PASSWORD: 'Update Password'
};
const ERRORS = {
    BAD_PASS: 'Sorry, there was a problem updating your password.',
    NO_MATCH: 'Those passwords do not appear to match. Please try again.',
    TOO_SHORT: 'Passwords must contain at least 8 characters, including one number',
    BAD_DELETE: 'Sorry, there was a problem deleting the user. Please refresh and try again.',
    BAD_RESET: 'This users password could not be reset at this time. Please try again later.'
};
const SUSPEND = 'Delete Account';
const INVALID_SUBMISSION = 'Invalid submission. Please update fields highlighted in red and submit again';
const BAD_UPDATE = 'There was a problem updating your profile. Please try again later.';
const USER_REMOVED = 'User deleted. You will now be redirected.';
const CONFIRM_DELETE = 'Are you sure you want to delete this user? This action cannot be undone.';

var Component = React.createClass({
    getInitialState: function () {
        var state = _.isObject(this.props.data) && !_.isArray(this.props.data) ? this.props.data : {};
        state = _.defaults({}, state, {isStudent: true, dob: new Date().toISOString()});
        return state;
    },
    componentDidMount: function () {
        var state;
        if (this.props.data && this.props.data.birthdate) {
            state = _.defaults({}, this.props.data, {dob: new Date(this.props.data.birthdate).toISOString()});
        } else {
            state = this.props.data;
        }
        this.setState(state);
        this.resolveRole();
    },
    componentWillReceiveProps: function (nextProps) {
        var state;
        if (nextProps.data && nextProps.data.birthdate) {
            state = _.defaults({}, nextProps.data, {dob: new Date(nextProps.data.birthdate).toISOString()});
        } else {
            state = nextProps.data;
        }
        this.setState(state);
        this.resolveRole();
    },
    suspendAccount: function () {
        if (window.confirm(CONFIRM_DELETE)) { //eslint-disable-line no-alert
            HttpManager.DELETE({url: GLOBALS.API_URL + 'user/' + this.state.user_id, handleErrors: false})
                .then(() => {
                    Toast.success(USER_REMOVED);
                })
                .catch(err => {
                    Toast.error(ERRORS.BAD_DELETE);
                    Log.error('User not deleted: ' + err.message, err);
                });
        }
    },
    resetPassword: function () {
        //note: This should only appear for adults, who have email addressed
        HttpManager.GET(`${GLOBALS.API_URL}user/${this.state.user_id}/reset`).then(() => {
            Toast.success('Password Reset. This user will recieve an email with further instructions.');
        }).catch(err => {
            Toast.error(ERRORS.BAD_RESET + (err.message ? ' Message: ' + err.message : ''));
            Log.log('Server refused profile update', err);
        });
    },
    removeParent: function (i) {
        var self = this;
        return function () {
            self.state.parents.splice(i, 1);
            self.setState({parents: self.state.parents});
        };
    },
    addParent: function () {
        var parents = this.state.parents || [];
        parents.push({name: 'Jane Adams'});
        this.setState({parents});
    },
    resolveRole: function () {
        var newState = {};
        var state = Store.getState();
        if (state.currentUser && state.currentUser.type !== 'CHILD') {
            newState.isStudent = false;
        } else {
            newState.isStudent = true;
        }
        this.setState(newState);
    },
    submitData: function () {
        /** @TODO MPR, 3/18/16: Remove unneeded fields*/
        var postData = {
            username: this.state.username,
            first_name: this.state.first_name, //eslint-disable-line camelcase
            last_name: this.state.last_name //eslint-disable-line camelcase
        };
        //if (!this.state.isStudent) {
        //    if (this.state.email) {
        postData.email = this.state.email;
        //    }
        postData.gender = this.state.gender;
        postData.birthdate = this.state.birthdate;
        postData.type = this.state.type;
        //}
        if (this.refs.formRef.isValid()) {
            HttpManager.PUT(`${GLOBALS.API_URL}user/${this.state.user_id}`, postData).then(() => {
                Toast.success('Profile Updated');
            }).catch(err => {
                Toast.error(BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
                Log.log('Server refused profile update', err, postData);
            });
        } else {
            Toast.error(INVALID_SUBMISSION);
        }
    },
    renderParentFields: function () {
        if (this.state.parents && this.state.parents.length) {
            return _.map(this.state.parents, (parent, i) => {
                /** @TODO MPR, 11/14/15: Implement Autocomplete, store parent ID*/
                return (
                        <span>
                            <Input
                                type="text"
                                groupClassName="has-addon"
                                value={parent.name}
                                placeholder="Parent or Guardian"
                                label="Parent or Guardian"
                                bsStyle={Validate.required(parent.name)}
                                hasFeedback
                                ref={`parentRef${i}`}
                                key={`parentRef${i}`}
                                addonAfter={<Button onClick={this.removeParent(i)} >X</Button>}
                                onChange={() => {
                                    var parents = this.state.parents;
                                    parents[i] = {name: this.refs[`parentRef${i}`].getValue()};
                                    this.setState({parents});
                                }}
                            />
                        </span>
                );
            });
        }
        return null;
    },
    renderSchoolInformation: function () {
        var teachers = _.map(this.state.teachers, this.renderTeacherInputs);
        if (!teachers.length) {
            teachers = null;
        }
        return (
           <div>
                <Input
                    type="select"
                    value={this.state.grade}
                    placeholder="Grade"
                    label="Grade"
                    ref="gradeInput"
                    onChange={() => this.setState({grade: this.refs.gradeInput.getValue()})}
                >{this.renderk8()}</Input>
                {teachers}
           </div>
        );
    },
    renderk8: function () {
        return (
            _.map(Array(9), (v, i) => {
                return (<option value={i}>{i === 0 ? 'k' : i}</option>);
            })
        );
    },
    renderTeacherInputs: function () {},
    renderEmail: function () {
        if (this.state.isStudent || this.state.email == null) {
            return null;
        }
        return (
            <Input
                type="text"
                value={this.state.email}
                placeholder="Email"
                label="Email"
                ref="emailInput"
                validate="required"
                name="emailInput"
                validationEvent="onBlur"
                disabled
                hasFeedback
                onChange={e => this.setState({email: e.target.value})} //eslint-disable-line camelcase
            />
        );
    },
    render: function () {
        /** @TODO MPR, 3/30/16: enable hiding edit for users without scope*/
        if (this.props.data == null || this.props.data.user_id == null
                // || !Util.decodePermissions(this.props.data.scope).update
        ) {
            return null;
        }
        return (
           <Layout className="edit-student">
                <Panel header={HEADINGS.EDIT_TITLE + this.state.first_name + ' ' + this.state.last_name} className="standard edit-profile">
                    <div className="left">
                        <ProfileImage user_id={this.props.data.user_id} link-below={true}/>
                        <p><a onClick={this.suspendAccount}>{SUSPEND}</a></p>
                    </div>
                    <div className="right"><Form ref="formRef">
                        <Input
                            type="text"
                            value={this.state.username}
                            placeholder="Username"
                            label="Username"
                            ref="usernameInput"
                            validate={[
                                Validate.max.bind(null, 25),
                                Validate.regex.bind(null, /^[a-zA-Z0-9_-]+$/),
                            ]}
                            name="usernameInput"
                            validationEvent="onBlur"
                            disabled={this.state.isStudent}
                            hasFeedback
                            onChange={e => this.setState({username: e.target.value})} //eslint-disable-line camelcase
                        />
                        {this.renderEmail()}
                        <Input
                            type="text"
                            value={this.state.first_name}
                            placeholder="first name"
                            label="First Name"
                            validate="required"
                            ref="firstnameInput"
                            name="firstnameInput"
                            validationEvent="onBlur"
                            hasFeedback
                            onChange={e => this.setState({first_name: e.target.value})} //eslint-disable-line camelcase
                            disabled={this.state.isStudent}
                        />
                        <Input
                            type="text"
                            value={this.state.last_name}
                            placeholder="last name"
                            label="Last Name"
                            validate="required"
                            ref="lastnameInput"
                            name="lastnameInput"
                            onChange={e => this.setState({last_name: e.target.value})} //eslint-disable-line camelcase
                            disabled={this.state.isStudent}
                        />
                        <DatePicker
                            type="text"
                            value={this.state.dob}
                            placeholder="date of birth"
                            label="Date of Birth"
                            ref="birthdateInput"
                            name="birthdateInput"
                            clearButtonElement="x"
                            onChange={value => this.setState({dob: value, birthdate: Date.parse(value)})}
                            disabled={this.state.isStudent}
                            calendarPlacement="top"
                        />
                        {''/*
                        <Input
                            type="select"
                            value={this.state.gender}
                            placeholder="Gender"
                            label="Gender"
                            validate="required"
                            ref="genderInput"
                            name="genderInput"
                            onChange={e => this.setState({gender: e.target.value})}
                        >
                                <option value="" >Select gender</option>
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="other">Other</option>
                        </Input>
                        <Input
                            type="email"
                            value={this.state.email}
                            placeholder="email"
                            label="email"
                            validate="required,email"
                            ref="emailInput"
                            name="emailInput"
                            onChange={e => this.setState({email: e.target.value})}
                        />
                        <h3>Parent or Guardian</h3>
                        {this.renderParentFields()}
                        <p><a onClick={this.addParent}>+ Add parent or guardian</a></p>
                        <h3>School Information</h3>
                        {this.renderSchoolInformation()}
                        */}
                        <Button onClick={this.submitData}> Save </Button>
                    </Form></div>
                </Panel>
                <UpdateUsername username={this.state.username} />
                <ChangePassword user_id={this.state.user_id} />
                <CodeChange user_id={this.state.user_id} />
            </Layout>
        );
    }
});

var isPassValid = function (password) {
    return password.length > 8 && ~password.search(/[0-9]+/);
};

var CodeChange = React.createClass({
    getInitialState: function () {
        return {code: ''};
    },
    submit: function () {
        var update = HttpManager.POST({url: `${GLOBALS.API_URL}user/${this.props.user_id}/code`}, {
            'code': this.state.code
        });
        update.then(() => {
            Toast.success('Code Reset for user. They will need to update their password on next login.');
        }).catch(err => {
            Log.warn('Update password failed.' + (err.message ? ' Message: ' + err.message : ''), err);
            Toast.error(ERRORS.BAD_PASS);
        });
    },
    render: function () {
        var state = Store.getState();
        if (state.currentUser.user_id === this.props.user_id) {
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
        if (!isPassValid(this.state.new)) {
            this.setState({extraProps: {bsStyle: 'error'}});
            Toast.error(ERRORS.TOO_SHORT);
        } else if (this.state.confirm === this.state.new) {
            var update = HttpManager.POST({url: `${GLOBALS.API_URL}user/${this.props.user_id}/password`}, {
                'current_password': this.state.current,
                'password': this.state.new,
                'password_confirmation': this.state.confirm,
                'user_id': this.props.user_id,
            });
            update.then(() => {
                Toast.success('Password Updated');
            }).catch(err => {
                Log.warn('Update password failed.' + (err.message ? ' Message: ' + err.message : ''), err);
                Toast.error(ERRORS.BAD_PASS);
            });
        } else {
            this.setState({extraProps: {bsStyle: 'error'}});
            Toast.error(ERRORS.NO_MATCH);
            /** @TODO MPR, 11/19/15: check on change, not submit*/
        }
    },
    render: function () {
        var state = Store.getState();
        if (state.currentUser.user_id !== this.props.user_id) {
            return null;
        }
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

const mapStateToProps = state => {
    var data = {};
    var loading = true;
    if (state.page && state.page.data != null) {
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

