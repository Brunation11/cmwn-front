import React from 'react';
import {Button, Input, Panel} from 'react-bootstrap';
import { connect } from 'react-redux';
import Moment from 'moment';

import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Layout from 'layouts/god_mode_two_col';
import GLOBALS from 'components/globals';
import Form from 'components/form';
import DropdownDatepicker from 'components/dropdown_datepicker';
import Log from 'components/log';

export const PAGE_UNIQUE_IDENTIFIER = 'god-mode-create-user';

const HEADINGS = {
    CREATE: 'Create User'
};

const INVALID_SUBMISSION = 'Invalid submission. Please update fields highlighted in red and submit again';
const BAD_CREATE = 'There was a problem creating user. Please try again later.';

var mapStateToProps;
var Page;

export class CreateUser extends React.Component {
    constructor() {
        super();
        this.state = {
            user_id: '', //eslint-disable-line camelcase
            first_name: '', //eslint-disable-line camelcase
            middle_name: '', //eslint-disable-line camelcase
            last_name: '', //eslint-disable-line camelcase
            gender: '',
            type: '',
            username: '',
            email: '',
            birthdate: ''
        };
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
            HttpManager.POST(`${GLOBALS.API_URL}user`, postData).then((res) => {
                Toast.success('User Created');
                this.setState({user_id: res.response.user_id}); //eslint-disable-line camelcase
            }).catch(err => {
                Toast.error(BAD_CREATE + (err.message ? ' Message: ' + err.message : ''));
                Log.log('Server refused user create', err, postData);
            });
        } else {
            Toast.error(INVALID_SUBMISSION);
        }
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
            </Input>
        );
    }

    renderEditableType() {
        return (
            <Input
                type="select"
                value={this.state.type}
                placeholder="Type"
                label="Type:"
                ref="typeInput"
                name="typeInput"
                validate="required"
                validationEvent="onBlur"
                onChange={e => this.setState({type: e.target.value})}
            >
                <option value="">Select Type</option>
                <option value="CHILD">Child</option>
                <option value="ADULT">Adult</option>
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

    renderEditableUserName() {
        return (
            <Input
                type="text"
                value={this.state.username}
                placeholder="user name"
                label="User Name:"
                ref="usernameInput"
                name="usernameInput"
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
                placeholder="email"
                label="Email:"
                ref="emailInput"
                name="emailInput"
                hasFeedback
                onChange={
                        e => this.setState({
                            email: e.target.value
                        })
                    }
            />
        );
    }

    renderFields() {
        return (
            <Form ref="formRef">
                {this.renderEditableUserName()}
                {this.renderEditableEmail()}
                {this.renderEditableFirstName()}
                {this.renderEditableMiddleName()}
                {this.renderEditableLastName()}
                {this.renderEditableGender()}
                {this.renderEditableType()}
                {this.renderEditableBirthday()}
                <br/>
                <br/>
                <Button className="purple standard"
                        onClick={this.submitData.bind(this)}
                >
                    Create
                </Button>
            </Form>
        );
    }

    renderUserCreateSuccess() {
        return (
            <div className="standard">
                <p> user created successfully. click
                    <a href={`/user/${this.state.user_id}`}>here</a>
                    to visit profile.
                </p>
                <p> click <a href="/sa/settings/user/create">here</a> to create another user</p>
            </div>
        );
    }

    render() {
        if (this.props.currentUser == null || _.isEmpty(this.props.currentUser)) return null;

        return (
            <Layout currentUser={this.props.currentUser}>
                <Panel className="standard" header={HEADINGS.CREATE}>
                    {this.state.user_id !== '' ? this.renderUserCreateSuccess() : this.renderFields()}
                </Panel>
            </Layout>
        );
    }
}

mapStateToProps = state => {
    var currentUser = {};
    var loading = true;

    if (state.page) {
        loading = state.page.loading;
    }

    if (state.currentUser != null) {
        currentUser = state.currentUser;
    }

    return {
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(CreateUser);
export default Page;
