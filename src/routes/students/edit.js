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

import 'routes/students/edit.scss';

const HEADINGS = {
    EDIT_TITLE: 'Info'
};
const SUSPEND = 'Suspend Account';

var Fields = React.createClass({
    getInitialState: function () {
        return _.isObject(this.props.data) && !_.isArray(this.props.data) ? this.props.data : {};
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
    renderParentFields: function () {
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
    },
    renderSchoolInformation: function () {
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
                {_.map(this.state.teachers, this.renderTeacherInputs)}
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
        if (this.props.data == null) {
            //return null;
        }
        return (
            <Panel header={HEADINGS.EDIT_TITLE} className="standard profile">
                <div className="left">
                    <ProfileImage url={this.state.profile_image} link-below={true}/>
                    <p><a onClick={this.suspendAccount}>{SUSPEND}</a></p>
                </div>
                <div className="right">
                    <Input
                        type="text"
                        value={this.state.name}
                        placeholder="name"
                        label="Name"
                        bsStyle={Validate.len(this.state.name)}
                        hasFeedback
                        ref="nameInput"
                        onChange={() => this.setState({title: this.refs.nameInput.getValue()})}
                    />
                    <Input
                        type="select"
                        value={this.state.gender}
                        placeholder="Gender"
                        label="Gender"
                        ref="genderInput"
                        onChange={() => this.setState({gender: this.refs.genderInput.getValue()})}
                    />
                    <Input
                        type="text"
                        value={this.state.birthdate}
                        placeholder="date of birth"
                        label="Date of Birth"
                        bsStyle={Validate.date(this.state.birthdate)}
                        hasFeedback
                        ref="birthdateInput"
                        onChange={() => this.setState({birthdate: this.refs.birthdateInput.getValue()})}
                    />
                    <Input
                        type="email"
                        value={this.state.email}
                        placeholder="email"
                        label="email"
                        bsStyle={Validate.email(this.state.email)}
                        hasFeedback
                        ref="emailInput"
                        onChange={() => this.setState({title: this.refs.emailInput.getValue()})}
                    />
                    <h3>Parent or Guardian</h3>
                    {this.renderParentFields()}
                    <p><a onClick={this.addParent}>+ Add parent or guardian</a></p>
                    <h3>School Information</h3>
                    {this.renderSchoolInformation()}
                    <Button onClick={this.submitData} > Save </Button>
                </div>
            </Panel>
        );
    }
});

var Edit = React.createClass({
    user: {},
    getInitialState: function () {
        return {
            code: '',
            title: '',
            description: ''
        };
    },
    componentWillMount: function () {
//        this.getUser();
    },
    getUser: function () {
        var id = this.props.params.id || Authorization.currentUser.id;
        var urlData = HttpManager.GET({url: GLOBALS.API_URL + 'users/' + id});
        urlData.then(res => {
            this.user = res.response.data;
            this.setState({
                code: this.user.code,
                title: this.user.title,
                description: this.user.description
            });
        });
    },
    submitData: function () {
    },
    render: function () {
        return (
           <Layout className="edit-student">
               <Fetcher data={{not: 'empty'}}>
                    <Fields />
               </Fetcher>
           </Layout>
         );
    }
});

export default Edit;

