import React from 'react';
import ReactDOM from 'react-dom';
import {Button, Input, Panel, FormControls} from 'react-bootstrap';
import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import Validate from 'components/validators';
import Toast from 'components/toast';
import History from 'components/history';
import Form from 'components/form';

import Layout from 'layouts/two_col';

const HEADINGS = {
    EDIT_TITLE: 'Info',
    UPLOAD: 'Data Import'
};

const LABELS = {
    SUBMIT: 'Submit'
};

const TERMS_COPY = <span>By checking the box below, you agree that you have read, understand, and accept <a href="/terms" target="_blank">ChangeMyWorldNow.com's terms and conditions</a>.</span>;

var isPassValid = function (password) {
    return password.length > 8 && ~password.search(/[0-9]+/);
};

var Edit = React.createClass({
    getInitialState: function () {
        this.organization = {};
        return {
            code: '',
            title: '',
            description: ''
        };
    },
    componentWillMount: function () {
        this.getOrganization();
    },
    getOrganization: function () {
        var urlData = HttpManager.GET({url: GLOBALS.API_URL + 'organizations/' + this.props.params.id});
        urlData.then(res => {
            this.organization = res.response.data;
            if (!res.response.data.can_update) { //eslint-disable-line camel_case
                History.replace(`/organization/${this.props.params.id}/profile`);
            }
            this.setState(this.organization);
        });
    },
    submitData: function () {
    },
    render: function () {
        if (this.state.uuid == null || !this.state.can_update) {
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
                    bsStyle={Validate.min(3, this.state.title)}
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
              <BulkUpload orgId={this.props.params.id}/>
           </Layout>
         );
    }
});

var BulkUpload = React.createClass({
    getInitialState: function () {
        return {
            studentCode: '',
            teacherCode: '',
            tos: false
        };
    },
    render: function () {
        return (
          <Panel header={HEADINGS.UPLOAD} className="standard">
            <iframe width="0" height="0" border="0" name="dummyframe" id="dummyframe"></iframe>
            <Form ref="formRef" method="post" target="dummyframe" encType="multipart/form-data" action={`${GLOBALS.API_URL}admin/importexcel`}
                onSubmit={e => {
                    try {
                        if (!this.refs.formRef.isValid()) {
                            e.preventDefault();
                            Toast.error('Please fill out all required fields');
                            return false;
                        } else if (this.state.tos === false) {
                            e.preventDefault();
                            Toast.error('You must agree to the terms to submit import.');
                            return false;
                        } else if (this.state.teacherCode === this.state.studentCode) {
                            e.preventDefault();
                            Toast.error('Teacher and Student access codes must be different');
                            return false;
                        } else if (!isPassValid(this.state.teacherCode) || !isPassValid(this.state.studentCode)) {
                            e.preventDefault();
                            Toast.error('Passwords must be a minimum of 8 characters and contain a number.');
                            return false;
                        } else if (!this.refs.fileInput.getValue()) {
                            e.preventDefault();
                            Toast.error('Please select an XLSX file to import.');
                            return false;
                        }
                    } catch(err) {
                        e.preventDefault();
                        return false;
                    }
                    Toast.success('Import submitted for processing. You will recieve an email once processing is complete.');
                    window.setTimeout(() => {
                        this.setState({
                            studentCode: '',
                            teacherCode: '',
                            tos: false
                        });
                        ReactDOM.findDOMNode(this.refs.fileInput).value = '';
                        ReactDOM.findDOMNode(this.refs.fileInput).type = '';
                        ReactDOM.findDOMNode(this.refs.fileInput).type = 'file';
                        ReactDOM.findDOMNode(this.refs.formRef).reset();
                    }, 0);
                }}
            >
                <input type="hidden" name="_token" value={HttpManager.token} />
                <input type="hidden" name="organizations" value={this.props.orgId} />
                <input type="hidden" name="organization_id" value={this.props.orgId} />
                <Input ref="fileInput" type="file" name="xlsx" chars="40" label="Upload Spreadsheet"/>
                <Input
                    type="text"
                    value={this.state.teacherCode}
                    placeholder="Teacher Access Code"
                    label="Teacher Access Code"
                    validate="required"
                    ref="teacherInput"
                    name="teacherAccessCode"
                    onChange={e => this.setState({teacherCode: e.target.value})} //eslint-disable-line camelcase
                />
                <Input
                    type="text"
                    value={this.state.studentCode}
                    placeholder="Student Access Code"
                    label="Student Access Code"
                    validate="required"
                    ref="studentInput"
                    name="studentAccessCode"
                    onChange={e => this.setState({studentCode: e.target.value})} //eslint-disable-line camelcase
                />
                <FormControls.Static value={TERMS_COPY} />
                <Input
                    type="checkbox"
                    checked={this.state.tos}
                    ref="tosInput"
                    label="I accept the terms and conditions."
                    name="tos"
                    onChange={e => this.setState({tos: e.target.checked})} //eslint-disable-line camelcase
                />
                <br />
                <Button type="submit" >{LABELS.SUBMIT}</Button>
            </Form>
          </Panel>
        );
    }
});

export default Edit;

