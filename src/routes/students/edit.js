import React from 'react';
import _ from 'lodash';
import {Button, Input, Panel} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import Authorization from 'components/authorization';
import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals';
import Validate from 'components/validators';
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
        state.uuid = this.props.uuid;
        return state;
    },
    suspendAccount: function () {
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
    submitData: function () {
        if (this.refs.formRef.isValid()) {
            HttpManager.POST(`${GLOBALS.API_URL}users/${this.state.uuid}`, {
                //first_name: this.state.first_name, //eslint-disable-line camelcase
                //last_name: this.state.last_name, //eslint-disable-line camelcase
                //sex: this.state.sex,
                //job: this.state.dob,
                //email: this.state.email,
                username: this.state.username
            });
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
    render: function () {
        if (this.props.data == null || this.props.data.can_update === false) {
            return null;
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
                        disabled
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
                        disabled
                    />
                    <Input
                        type="select"
                        value={this.state.sex}
                        placeholder="Gender"
                        label="Gender"
                        validate="required"
                        ref="sexInput"
                        name="sexInput"
                        onChange={e => this.setState({sex: e.target.value})}
                        disabled
                    >
                            <option value="" disabled >Select gender</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="other">Other</option>
                    </Input>
                    <Input
                        type="text"
                        value={this.state.birthdate}
                        placeholder="date of birth"
                        label="Date of Birth"
                        validate="required"
                        ref="birthdateInput"
                        name="birthdateInput"
                        onChange={e => this.setState({dob: e.target.value})}
                        disabled
                    />
                    {''/*
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
                'user_uuid': this.props.uuid
            });
            update.then(() => {})
                .catch(() => {
                    /** #TODO MPR, 12/22/15: handle failure */
                });
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
        this.uuid = this.props.params.id || Authorization.currentUser.uuid;
        this.url = GLOBALS.API_URL + 'users/' + this.uuid;
        return {};
    },
    render: function () {
        return (
           <Layout className="edit-student">
                <Fetcher url={this.url}>
                    <Fields uuid={this.uuid} />
                </Fetcher>
                <ChangePassword uuid={this.uuid} />
           </Layout>
         );
    }
});

export default Edit;

