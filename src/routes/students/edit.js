import React from 'react';
import _ from 'lodash';
import {Button, Input, Panel} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals';
import Validate from 'components/validators';
import Fetcher from 'components/fetcher';

const HEADINGS = {
    EDIT_TITLE: 'Info'
};

var Fields = React.createClass({
    getInitialState: function () {
        return this.props.data;
    },
    addParent: function () {
        var parents = this.state.parents;
        parents.push({name: 'Jane Adams'});
        this.setState({parents});
    },
    renderParentFields: function () {
        return _.map(this.state.parents, (parent, i) => {
            /** @TODO MPR, 11/14/15: Implement Autocomplete, store parent ID*/
            return (
               <Input
                   type="text"
                   value={parent.name}
                   placeholder="Parent or Guardian"
                   label="Parent or Guardian"
                   bsStyle={Validate.required(parent.name)}
                   hasFeedback
                   ref={`parentRef${i}`}
                   key={`parentRef${i}`}
                   onChange={() => {
                       var parents = this.state.parents;
                       parents[i] = this.refs[`parentRef${i}`].getValue();
                       this.setState({parents});
                   }}
               />
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
            <Panel header={HEADINGS.EDIT_TITLE} className="standard">
                <ProfileImage url={this.state.profile_image} />
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
        this.getUser();
    },
    getUser: function () {
        var urlData = HttpManager.GET({url: GLOBALS.API_URL + 'users/' + this.props.params.id});
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
           <Layout>
               <Fetcher>
                    <Fields />
               </Fetcher>
           </Layout>
         );
    }
});

export default Edit;

