import React from 'react';
import _ from 'lodash';
import {Button, Input, Panel} from 'react-bootstrap';
import { connect } from 'react-redux';
import Moment from 'moment';

import Actions from 'components/actions';
import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Layout from 'layouts/god_mode_two_col';
import GLOBALS from 'components/globals';
import Form from 'components/form';
import DropdownDatepicker from 'components/dropdown_datepicker';
import Log from 'components/log';

export const PAGE_UNIQUE_IDENTIFIER = 'god-mode-edit-user';

var mapStateToProps;
var Page;

const HEADINGS = {
    EDIT: 'Edit User: '
};

const INVALID_SUBMISSION = 'Invalid submission. Please update fields highlighted in red and submit again';
const BAD_UPDATE = 'There was a problem updating your profile. Please try again later.';

export class EditUser extends React.Component {
    constructor(props) {
        super();
        this.state = props.data;
    }

    componentWillReceiveProps(nextProps) {
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

    renderEditableUsername() {
        return (
            <Input
                type="text"
                value={this.state.username}
                placeholder="username"
                label="Username:"
                validate="required"
                ref="usernameInput"
                name="usernameInput"
                validationEvent="onBlur"
                hasFeedback
                onChange={
                    e => this.setState({
                        username: e.target.value
                    })
                }
            />
        );
    }

    renderEditableEmail() {
        return (
            <Input
                type="text"
                value={this.state.email}
                placeholder="Email"
                label="Email:"
                validate="required"
                ref="emailInput"
                name="emailInput"
                validationEvent="onBlur"
                hasFeedback
                onChange={
                    e => this.setState({
                        email: e.target.value //eslint-disable-line camelcase
                    })
                }
            />
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
                validationEvent="onBlur"
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
                {this.renderStaticFeild('User Type', this.props.data.type)}
                {this.renderEditableUsername()}
                {this.renderEditableEmail()}
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
            first_name: this.state.first_name, //eslint-disable-line camelcase
            last_name: this.state.last_name, //eslint-disable-line camelcase
            email: this.state.email,
            gender: this.state.gender,
            type: this.state.type,
            middle_name: this.state.middle_name, //eslint-disable-line camelcase
        };

        if (birthdate.isValid()) {
            postData.birthdate = birthdate.format('YYYY-MM-DD');
        }

        if (this.refs.formRef.isValid()) {
            HttpManager.PUT(`${GLOBALS.API_URL}user/${this.state.user_id}`, postData).then(() => {
                Toast.success('Profile Updated');
                Actions.dispatch.START_RELOAD_PAGE(this.props.state);
            }).catch(err => {
                Toast.error(BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
                Log.log('Server refused profile update', err, postData);
            });
        } else {
            Toast.error(INVALID_SUBMISSION);
        }
    }

    render() {
        if (this.props.data === null || _.isEmpty(this.props.data)) return null;

        return (
            <Layout classname="edit-student"
                currentUser={this.props.currentUser}
                navMenuId="navMenu"
            >
                <Panel header={`${HEADINGS.EDIT} ${this.props.data.username}`}
                    className="standard edit-profile"
                >
                    <div className="left">
                        {this.renderUserFields()}
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
    if (state.currentUser != null) {
        currentUser = state.currentUser;
    }

    return {
        data,
        state,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(EditUser);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
