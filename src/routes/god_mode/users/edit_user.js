import React from 'react';
import _ from 'lodash';
import {Button, Input, Panel} from 'react-bootstrap';
import { connect } from 'react-redux';
import Moment from 'moment';

import Actions from 'components/actions';
import ClassNames from 'classnames';
import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals';
import Validate from 'components/validators';
import Util from 'components/util';
import UpdateUsername from 'components/update_username';
import ProfileImage from 'components/profile_image';
import Form from 'components/form';
import DropdownDatepicker from 'components/dropdown_datepicker';
import ACTION_CONSTANTS from 'components/action_constants';
import CodeChange from 'components/code_change';
import ForgotPass from 'components/forgot_pass';
import ChangePassword from 'components/change_password';
import 'routes/users/edit.scss';

export const PAGE_UNIQUE_IDENTIFIER = 'god-mode-edit-user';

var mapStateToProps;
var Page;

const HEADINGS = {
    EDIT : 'Edit User: '
};

const INVALID_SUBMISSION = 'Invalid submission. Please update fields highlighted in red and submit again';
const BAD_UPDATE = 'There was a problem updating your profile. Please try again later.';

const EDITABLE_FIELDS = [
    'first_name',
    'middle_name',
    'last_name',
    'gender',
    'birthdate',
];

export class EditUser extends React.Component {
    constructor(props) {
        debugger;
        super();
        this.state = props.data;
    }

    componentWillReceiveProps(nextProps) {
        debugger;
        this.setState(nextProps.data);
    }

    shouldComponentUpdate() {
        return (true);
    }

    renderStaticFeild(fieldName, value) {
        return (
            <span className="user-metadata">
                <p className="standard field">{fieldName}: {value}</p>
            </span>
        );
    }

    renderEditableMiddleName() {
        return (
            <Input
                type="text"
                value={this.state.middle_name}
                placeholder="middle name"
                label="Middle Name:"
                ref="middlenameInput"
                name="middlenameInput"
                hasFeedback
                onChange={
                        e => this.setState({
                            middle_name: e.target.value //eslint-disable-line camelcase
                        })
                    }
            />
        );
    }

    renderEditableLastName() {
        return (
            <Input
                type="text"
                value={this.state.last_name}
                placeholder="last name"
                label="Last Name:"
                validate="required"
                ref="lastnameInput"
                name="lastnameInput"
                hasFeedback
                onChange={
                        e => this.setState({
                            last_name: e.target.value //eslint-disable-line camelcase
                        })
                    }
            />
        );
    }

    renderEditableFirstName() {
        return (
            <Input
                type="text"
                value={this.state.first_name}
                placeholder="first name"
                label="First Name:"
                validate="required"
                ref="firstnameInput"
                name="firstnameInput"
                validationEvent="onBlur"
                hasFeedback
                onChange={
                    e => this.setState({
                        first_name: e.target.value //eslint-disable-line camelcase
                    })
                }
            />
        );
    }

    renderEditableGender() {
        return (
            <Input
                type="select"
                value={this.state.gender}
                placeholder="Gender"
                label="Gender"
                ref="genderInput"
                name="genderInput"
                onChange={e => this.setState({gender: e.target.value})}
            >
                <option value="">Select gender</option>
                <option value="F">Female</option>
                <option value="M">Male</option>
                <option value="O">Other</option>
            </Input>
        );
    }

    renderEditableBirthday() {
        var dob = this.state.birthdate ?
            new Date(this.state.birthdate).toISOString() : new Date().toISOString();
        return (
            <DropdownDatepicker
                ref="dropdownDatepicker"
                value={dob}
                hasFeedback
                onChange={
                    date => {
                        this.setState({
                            birthdate: Date.parse(date)
                        });
                    }
                }
            />
        );
    }

    renderUserFields() {
        return (
            <Form ref="formRef">
                {this.renderStaticFeild('Username', this.props.data.username)}
                {this.renderStaticFeild('Email', this.props.data.email)}
                {this.renderStaticFeild('Type',this.props.data.type)}
                {this.renderEditableFirstName()}
                {this.renderEditableMiddleName()}
                {this.renderEditableLastName()}
                {this.renderEditableGender()}
                {this.renderEditableBirthday()}
                <br/>
                <br/>
                <Button className="right"
                        onClick={this.submitData.bind(this)}> Save </Button>
            </Form>
        );
    }

    submitData() {
        var birthdate = Moment(this.state.birthdate);

        var postData = {
            username: this.state.username,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            gender: this.state.gender,
            type: this.state.type,
            middle_name: this.state.middle_name,
        };

        if (birthdate.isValid()) {
            postData.birthdate = birthdate.format('YYYY-MM-DD');
        }

        if (this.refs.formRef.isValid()) {
            HttpManager.PUT(`${GLOBALS.API_URL}user/${this.state.user_id}`, postData).then(() => {
                Toast.success('Profile Updated');
                Actions.dispatch[ACTION_CONSTANTS.UPDATE_USERNAME]({'username': this.state.username});
            }).catch(err => {
                Toast.error(BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
                Log.log('Server refused profile update', err, postData);
            });
        } else {
            Toast.error(INVALID_SUBMISSION);
        }
    }

    render() {
        if (this.props.data == null || this.props.data == {}) return null;

        return (
            <Layout currentUser={this.props.currentUser} classname="edit-student">
                <Panel header={`${HEADINGS.EDIT} ${this.props.data.username}`} className="standard edit-profile">
                    <div className="left">
                        {this.renderUserFields()}
                    </div>
                </Panel>
                <UpdateUsername
                    className={ClassNames({
                        hidden:
                            this.props.data.type !== 'CHILD' ||
                            this.props.data.user_id !== this.props.currentUser.user_id
                    })}
                    username={this.props.data.username}
                />
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
    if (state.currentUser != null) {
        currentUser = state.currentUser;
    }

    return {
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(EditUser);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
