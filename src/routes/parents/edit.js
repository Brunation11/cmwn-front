import React from 'react';
import _ from 'lodash';
import {Button, Input, Panel} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import Authorization from 'components/authorization';
import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals';
import Fetcher from 'components/fetcher';
import ProfileImage from 'components/profile_image';
import Form from 'components/form';

import 'routes/students/edit.scss';

const HEADINGS = {
    EDIT_TITLE: 'Info',
    PASSWORD: 'Update Password'
};
const SUSPEND = 'Suspend Account';

var Fields = React.createClass({
    getInitialState: function () {
        var state = _.isObject(this.props.data) && !_.isArray(this.props.data) ? this.props.data : {};
        state.id = this.props.id;
        return state;
    },
    suspendAccount: function () {
    },
    submitData: function () {
        if (this.refs.formRef.isValid()) {
            HttpManager.POST(`${GLOBALS.API_URL}users/${this.state.id}`, {
                first_name: this.state.first_name, //eslint-disable-line camelcase
                last_name: this.state.last_name, //eslint-disable-line camelcase
                //sex: this.state.sex,
                //dob: this.state.dob,
                email: this.state.email,
                username: this.state.username
            });
        }
    },
    render: function () {
        if (this.props.data == null) {
            //return null;
        }
        return (
            <Panel header={HEADINGS.EDIT_TITLE} className="standard profile">
                <div className="left">
                    <ProfileImage url={this.state.profile_image} link-below={true}/>
                    <p><a onClick={this.suspendAccount}>{SUSPEND}</a></p>
                </div>
                <div className="right"><Form ref="formRef">
                    <Input
                        type="text"
                        value={this.state.username}
                        placeholder="Username"
                        label="Username"
                        validate="required"
                        ref="usernameInput"
                        name="usernameInput"
                        validationEvent="onBlur"
                        hasFeedback
                        onChange={e => this.setState({username: e.target.value})} //eslint-disable-line camelcase
                    />
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
                    />
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
                    <Button onClick={this.submitData}> Save </Button>
                </Form></div>
            </Panel>
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
            var update = HttpManager.POST({url: `${GLOBALS.API_URL}/auth/password`}, {
                'current_password': this.state.current,
                'password': this.state.new,
                'password_confirmation': this.state.confirm,
                'user_id': this.props.id
            });
            update.then(() => {});
            /** #TODO MPR, 11/19/15: handle failure */
        } else {
            this.setState({extraProps: {bsStyle: 'error'}});
            /** @TODO MPR, 11/19/15: check on change, not submit*/
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

var Edit = React.createClass({
    getInitialState: function () {
        this.id = this.props.params.id || Authorization.currentUser.id;
        this.url = GLOBALS.API_URL + 'users/' + this.id;
        return {};
    },
    render: function () {
        return (
           <Layout className="edit-student">
                <Fetcher url={this.url}>
                    <Fields id={this.id} />
                </Fetcher>
                <ChangePassword id={this.id} />
           </Layout>
         );
    }
});

export default Edit;

