import React from 'react';
import {Button, Input, Panel} from 'react-bootstrap';
import { connect } from 'react-redux';
import {Link} from 'react-router';

import HttpManager from 'components/http_manager';
import Log from 'components/log';
import Form from 'components/form';
import Toast from 'components/toast';
import Util from 'components/util';
import History from 'components/history';
import GLOBALS from 'components/globals';

import Layout from 'layouts/two_col';

const HEADINGS = {
    EDIT_TITLE: 'Info'
};
const BREADCRUMB = {
    HOME: 'Home',
    GROUPS: 'Groups'
};

const BAD_UPDATE = 'There was a problem updating your profile. Please try again later.';

const ERRORS = {
    BAD_UPDATE: 'Could not create school. Please try again later.',
    INVALID_SUBMISSION: 'Invalid submission. Please update fields highlighted in red and submit again'
};

var Component = React.createClass({
    getInitialState: function () {
        return {
            code: '',
            title: '',
            description: ''
        };
    },
    componentWillMount: function () {
        this.setState(this.props.data);
    },
    componentWillReceiveProps: function (newProps) {
        this.setState(newProps.data);
    },
    submitData: function () {
        var postData = {
            title: this.state.title,
            organization_id: this.props.data.organization_id, //eslint-disable-line camelcase
            description: this.state.description
        };
        HttpManager.PUT({url: this.props.data._links.self.href}, postData).then(() => {
            Toast.success('Class Updated');
        }).catch(err => {
            Toast.error(BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
            Log.log('Server refused district update', err, postData);
        });
    },
    render: function () {
        if (this.props.data.group_id == null || !Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        return (
           <Layout>
                <h2>{this.props.data.title}</h2>
                <div className="breadcrumb">
                    <Link to="/">{BREADCRUMB.HOME}</Link>
                    <Link to="/groups">{BREADCRUMB.GROUPS}</Link>
                    <span>{this.props.data.title}</span>
                </div>
              <Panel header={HEADINGS.EDIT_TITLE} className="standard">
                <Input
                    type="text"
                    value={this.state.title}
                    placeholder="Class Name"
                    label="Class Name"
                    validate="required"
                    ref="titleInput"
                    name="titleInput"
                    onChange={e => this.setState({title: e.target.value})} //eslint-disable-line camelcase
                />
                <Input
                    type="text"
                    value={this.state.description}
                    placeholder="Description"
                    label="Description"
                    validate="required"
                    ref="codeInput"
                    name="codeInput"
                    onChange={e => this.setState({description: e.target.value})} //eslint-disable-line camelcase
                />
                 <Button onClick={this.submitData} > Save </Button>
              </Panel>
              <CreateStudent data={this.props.data}/>
           </Layout>
         );
    }
});

var CreateStudent = React.createClass({
    getInitialState: function () {
        return {
            title: ''
        };
    },
    submitData: function () {
        var postData = {
            first_name: this.state.first, //eslint-disable-line camelcase
            group_id: this.props.data.group_id, //eslint-disable-line camelcase
            last_name: this.state.last, //eslint-disable-line camelcase
            email: this.state.first + '@' + this.state.last + '.com',
            username: this.state.first + '@' + this.state.last + '.com',
            type: 'ADULT'
        };
        if (this.refs.formRef.isValid()) {
            HttpManager.POST({
                //url: this.props.data._links.users
                url: GLOBALS.API_URL + 'user'
            }, postData).then(res => {
                if (res.response && res.response.user_id) {
                    History.push(`/user/${res.response.user_id}?message=created`);
                }
            }).catch(err => {
                Toast.error(ERRORS.BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
                Log.log('Server refused class create', err, postData);
            });
        } else {
            Toast.error(ERRORS.INVALID_SUBMISSION);
        }
    },
    render: function () {
        return (
        <Panel>
            <Form ref="formRef">
                 <Input
                    type="text"
                    value={this.state.first}
                    placeholder="First Name"
                    label="First Name"
                    validate="required"
                    hasFeedback
                    ref="firstInput"
                    onChange={e => this.setState({first: e.target.value})}
                 />
                 <Input
                    type="text"
                    value={this.state.last}
                    placeholder="title"
                    label="Last Name"
                    validate="required"
                    hasFeedback
                    ref="lastInput"
                    onChange={e => this.setState({last: e.target.value})}
                 />
                <Button onClick={this.submitData}> Create </Button>
            </Form>
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

