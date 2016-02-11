import React from 'react';
import {Button, Input, Panel} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import History from 'components/history';
import Form from 'components/form';
import Log from 'components/log';
import Toast from 'components/toast';

import Layout from 'layouts/two_col';

const ERRORS = {
    BAD_UPDATE: 'There was a problem updating your profile. Please try again later.',
    INVALID_SUBMISSION: 'Invalid submission. Please update fields highlighted in red and submit again'
};

const HEADINGS = {
    EDIT_TITLE: 'Info'
};

var Edit = React.createClass({
    getInitialState: function () {
        this.district = {};
        return {
            code: '',
            title: '',
            description: ''
        };
    },
    componentWillMount: function () {
        this.getDistrict();
    },
    getDistrict: function () {
        var urlData = HttpManager.GET({url: GLOBALS.API_URL + 'districts/' + this.props.params.id});
        urlData.then(res => {
            this.district = res.response.data;
            if (!this.district.can_update) { //eslint-disable-line camel_case
                History.replaceState(null, `/district/${this.props.params.id}/profile`);
            }
            this.setState({
                code: this.district.code,
                title: this.district.title,
                description: this.district.description
            });
        });
    },
    submitData: function () {
    },
    render: function () {
        if (this.district == null || !this.district.can_update) {
            return null;
        }
        return (
           <Layout>
              <Panel header={HEADINGS.EDIT_TITLE} className="standard">
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
           </Layout>
         );
    }
});

var CreateOrganization = React.createClass({
    getInitialState: function () {
        return {
            title: ''
        };
    },
    submitData: function () {
        var postData = {
            username: this.state.username
        };
        if (this.refs.formRef.isValid()) {
            HttpManager.POST(`${GLOBALS.API_URL}organization`, postData).then(res => {
                if (res.response && res.response.data && res.response.data.uuid) {
                    History.replaceState(null, `/organization/${res.response.data.uuid}?message=created`);
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
        <Panel>
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
                <Button onClick={this.submitData}> Create </Button>
            </Form>
        </Panel>
        );
    }
});

export default Edit;

