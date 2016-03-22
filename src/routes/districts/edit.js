import React from 'react';
import {Button, Input, Panel} from 'react-bootstrap';
import { connect } from 'react-redux';

import HttpManager from 'components/http_manager';
import History from 'components/history';
import Form from 'components/form';
import Log from 'components/log';
import Toast from 'components/toast';
import GLOBALS from 'components/globals';
import Util from 'components/util';

import Layout from 'layouts/two_col';

const ERRORS = {
    BAD_UPDATE: 'Could not create school. Please try again later.',
    INVALID_SUBMISSION: 'Invalid submission. Please update fields highlighted in red and submit again'
};

const HEADINGS = {
    EDIT_TITLE: 'Edit District: ',
    CREATE_SCHOOL: 'Create School in this District'
};

const BAD_UPDATE = 'There was a problem updating your profile. Please try again later.';

const PAGE_UNIQUE_IDENTIFIER = 'district-edit';

var Component = React.createClass({
    getInitialState: function () {
        return {
            id: this.props.id || this.props.params.id,
            code: '',
            title: '',
            description: ''
        };
    },
    componentDidMount: function () {
        this.setState(this.props.data);
    },
    componentWillReceiveProps: function (newProps) {
        this.setState(newProps.data);
    },
    submitData: function () {
        var postData = {
            title: this.state.title,
            description: this.state.description
        };
        HttpManager.PUT(this.props.data._links.self.href, postData).then(() => {
            Toast.success('District Updated');
        }).catch(err => {
            Toast.error(BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
            Log.log('Server refused district update', err, postData);
        });
    },
    render: function () {
        if (this.props.data == null || !Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        return (
           <Layout className={PAGE_UNIQUE_IDENTIFIER}>
              <Panel header={HEADINGS.EDIT_TITLE + this.props.data.title} className="standard">
                 <Input
                    type="text"
                    value={this.state.title}
                    placeholder="title"
                    label="Title"
                    validate="required"
                    hasFeedback
                    ref="titleInput"
                    onChange={() => this.setState({title: this.refs.titleInput.getValue()})}
                 />
                 <Input
                    type="textarea"
                    value={this.state.description}
                    placeholder="description"
                    label="Description"
                    ref="descriptionInput"
                    onChange={() => this.setState({description: this.refs.descriptionInput.getValue()})}
                 />
                 <Button onClick={this.submitData} > Save </Button>
              </Panel>
              <CreateSchool districtId={this.props.data.org_id} data={this.props.data}/>
           </Layout>
         );
    }
});

var CreateSchool = React.createClass({
    getInitialState: function () {
        return {
            title: ''
        };
    },
    submitData: function () {
        var postData = {
            title: this.state.title,
            organization_id: this.props.districtId, //eslint-disable-line camelcase
            meta: {
                code: this.state.code
            },
            description: this.state.title
        };
        if (this.refs.formRef.isValid()) {
            HttpManager.POST({
                //url: this.props.data._links.orgs
                url: GLOBALS.API_URL + 'group'
            }, postData).then(res => {
                if (res.response && res.response.group_id) {
                    History.replace(`/school/${res.response.group_id}?message=created`);
                }
            }).catch(err => {
                Toast.error(ERRORS.BAD_UPDATE + (err.message ? ' Message: ' + err.message : ''));
                Log.log('Server refused school create', err, postData);
            });
        } else {
            Toast.error(ERRORS.INVALID_SUBMISSION);
        }
    },
    render: function () {
        return (
        <Panel header={HEADINGS.CREATE_SCHOOL} className="standard">
            <Form ref="formRef">
                <Input
                    type="text"
                    value={this.state.title}
                    placeholder="School Name"
                    label="School Name"
                    validate="required"
                    ref="titleInput"
                    name="titleInput"
                    onChange={e => this.setState({title: e.target.value})} //eslint-disable-line camelcase
                />
                <Input
                    type="text"
                    value={this.state.code}
                    placeholder="School Code"
                    label="School Code"
                    validate="required"
                    ref="codeInput"
                    name="codeInput"
                    onChange={e => this.setState({code: e.target.value})} //eslint-disable-line camelcase
                />
                <Button onClick={this.submitData}> Create </Button>
            </Form>
        </Panel>
        );
    }
});

const mapStateToProps = state => {
    var data = {title: ''};
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
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

